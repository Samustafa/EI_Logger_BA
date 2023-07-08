import {
    AttachInfo,
    BadgeText,
    BookMark,
    DetachInfo,
    OnActivatedActiveInfoType,
    OnCompletedDetailsType,
    OnUpdatedChangeInfoType,
    QueryAndSearchEngineName,
    QueryKeyWord,
    RemoveInfo,
    SearchEngineName,
    Tab,
    TabAction,
    TabCacheInfo,
    TabIdentifier,
    TabWithGroupId
} from "@pages/popup/Types";
import {ITab} from "@pages/popup/Database/DatabaseInterfaces";
import {dataBase} from "@pages/popup/Database/database";
import browser, {tabs} from "webextension-polyfill";
import {getUTCDateTime, sendMessageToCS} from "@pages/popup/UtilityFunctions";
import {bgLoggingConstants} from "@pages/background/BGLoggingConstants";
import {queryKeyWords, searchEngineSerpInfos} from "@pages/popup/model/SearchEngineSerpInfo";
import {v4 as uuid} from 'uuid';

const openedTabsCache = new Map<number, TabCacheInfo>();

export async function handleOnInstalled() {
    setBadgeText('OFF');
    await dataBase.setExtensionState('NOT_AUTHENTICATED');
}

export function handleOnCompleted(details: OnCompletedDetailsType) {
    const tabFinishedLoading = 0;
    if (details.frameId !== tabFinishedLoading) return

    tabs.get(details.tabId)
        .then(tab => logTabAndLogHtmlIfSerp(tab))
        .catch(error => console.warn("handleOnCompleted " + error));
}

export function handleTabUpdated(id: number, changeInfo: OnUpdatedChangeInfoType, tab: Tab) {
    if (changeInfo.pinned !== undefined) {
        const iTab = prePareITabFromTab(tab, changeInfo.pinned ? "TAB:PINNED" : "TAB:UNPINNED");
        dataBase.saveTabInfo(iTab);
    }
}

export function handleTabRemoved(tabId: number) {
    dataBase.getLastTabWithId(tabId)
        .then((iTab) => {
            if (!iTab) throw new Error(`handleTabRemoved: Couldn't fetch tab with the ID ${tabId}`)
            dataBase.saveTabInfo(prePareITabFromITab(iTab, "TAB:CLOSED"));
            openedTabsCache.delete(tabId);
        })
        .catch((e) => console.warn("handleTabRemoved " + JSON.stringify(e), "probably the tab was closed before it completed loading and thus the extension didn't log it and therefore couldn't log its close event"))
}

export function handleTabActivated(onActivatedActiveInfoType: OnActivatedActiveInfoType) {
    dataBase.getLastTabWithId(onActivatedActiveInfoType.tabId)
        .then((iTab) => {
            if (iTab) dataBase.saveTabInfo(prePareITabFromITab(iTab, "TAB:ACTIVATED"))
        })
        .catch((e) => console.error("handleTabActivated " + e))
}

export async function handleBookmarkCreated(id: string, bookmark: BookMark) {
    const iTab = await prepareITabFromBookMark(bookmark, "TAB:BOOKMARK:ADDED");
    dataBase.saveTabInfo(iTab);
}

export async function handleBookmarkRemoved(id: string, removeInfo: RemoveInfo) {
    const iTab = await prepareITabFromBookMark(removeInfo.node, "TAB:BOOKMARK:REMOVED");
    dataBase.saveTabInfo(iTab);
}

export async function handleTabAttached(tabId: number, attachInfo: AttachInfo) {
    const tab = await tabs.get(tabId);
    const iTab: ITab = {
        action: "TAB:ATTACHED:TO:WINDOW",
        tabId: tabId,
        tabUuid: openedTabsCache.get(tabId)?.tabUuid ?? "",
        groupId: -1,
        tabIndex: attachInfo.newPosition,
        taskId: bgLoggingConstants.taskId,
        timeStamp: getUTCDateTime(),
        title: tab?.title ?? "",
        url: tab?.url ?? "",
        windowId: attachInfo.newWindowId,
    };
    dataBase.saveTabInfo(iTab);
}

export async function handleTabDetached(tabId: number, detachInfo: DetachInfo) {
    const tab = await tabs.get(tabId);
    const iTab: ITab = {
        action: "TAB:DETACHED:FROM:WINDOW",
        tabId: tabId,
        tabUuid: openedTabsCache.get(tabId)?.tabUuid ?? "",
        groupId: -1,
        tabIndex: detachInfo.oldPosition,
        taskId: bgLoggingConstants.taskId,
        timeStamp: getUTCDateTime(),
        title: tab?.title ?? "",
        url: tab?.url ?? "",
        windowId: detachInfo.oldWindowId,
    }
    dataBase.saveTabInfo(iTab);
}


//Helper Functions
function logTabAndLogHtmlIfSerp(tab: Tab) {
    const tabAction: TabAction = openedTabsCache.has(tab?.id ?? -1) ? "TAB:URL_CHANGED" : "TAB:CREATED";
    const {query, searchEngineName} = getSeNameAndQueryIfSerp(tab.url as string, tab.id as number);


    const isSerp = !!query && !!searchEngineName
    const serpIdentifier = isSerp ? uuid() : undefined;

    handleSaveTabAfterNewTabOrNewUrl(tab, tabAction, query, searchEngineName, serpIdentifier);
    if (tabAction === "TAB:CREATED" && tab.active) {
        handleTabActivated({
            tabId: tab.id as number,
            windowId: tab.windowId as number
        }); //this means a new tab was created and directly activated. Depending on the OnActivated event will cause faulty data, because the onCompleted event will be anyway fired afterward and will therefore cause faulty data
    }

    if (!isSerp) return;

    logHtmlOfSerp();

    function getSeNameAndQueryIfSerp(url: string, tabId: number): QueryAndSearchEngineName {

        let queryKeyWord: QueryKeyWord | undefined = undefined;

        getQueryKeyWordIfExists(url);

        if (!queryKeyWord) return {query: undefined, searchEngineName: undefined};

        return extractSeNameAndQuery(url, tabId, queryKeyWord);

        function getQueryKeyWordIfExists(url: string) {
            queryKeyWords.some(keyword => {
                const isQuery = url.includes(keyword);

                if (!isQuery) return false;

                queryKeyWord = keyword;
                return true;
            });
        }

        function extractSeNameAndQuery(url: string, tanId: number, queryKeyWord: QueryKeyWord): QueryAndSearchEngineName {
            let query: string | undefined = undefined;
            let searchEngineName: SearchEngineName | undefined = undefined;
            searchEngineSerpInfos.get(queryKeyWord)?.some((searchEngineSerpInfo) => {
                const isSerp = searchEngineSerpInfo.isUrlSERP(url);

                if (!isSerp) return false;

                query = searchEngineSerpInfo.getQuery(url);
                searchEngineName = searchEngineSerpInfo.searchEngineName;
                return true;
            })
            return {query, searchEngineName};
        }
    }

    function logHtmlOfSerp() {
        sendMessageToCS(tab.id as number, serpIdentifier as string, "LOG_HTML_OF_SERP");
    }
}

function prePareITabFromTab(tab: Tab, tabAction: TabAction, query?: string, searchEngineName?: SearchEngineName, serpIdentifier?: string): ITab {
    const tabExtended = tab as TabWithGroupId;

    return {
        action: tabAction,
        tabId: tab?.id ?? -1,
        tabUuid: openedTabsCache.get(tab?.id ?? -1)?.tabUuid ?? uuid(),
        timeStamp: getUTCDateTime(),
        taskId: bgLoggingConstants.taskId,
        groupId: tabExtended.groupId,
        tabIndex: tab.index,
        windowId: tab?.windowId ?? -1,
        title: tab?.title ?? "",
        url: tab?.pendingUrl ?? tab?.url ?? "",
        query: query,
        searchEngineName: searchEngineName,
        serpIdentifier: serpIdentifier,
    }
}

function prePareITabFromITab(tab: ITab, tabAction: TabAction): ITab {

    return {
        action: tabAction,
        tabId: tab.tabId,
        tabUuid: openedTabsCache.get(tab.tabId)?.tabUuid ?? uuid(),
        timeStamp: getUTCDateTime(),
        taskId: bgLoggingConstants.taskId,
        groupId: tab.groupId,
        tabIndex: tab.tabIndex,
        windowId: tab.windowId,
        title: tab.title,
        url: tab.url,
    }
}

/**
 * Creates an ITab from a bookmark. The ITab has empty values for groupId, tabId, tabIndex and windowId because they are not available for type BookMark.
 * @param bookmark the bookmark node
 * @param tabAction
 */
async function prepareITabFromBookMark(bookmark: BookMark, tabAction: "TAB:BOOKMARK:REMOVED" | "TAB:BOOKMARK:ADDED"): Promise<ITab> {
    const activeTabs = await tabs.query({currentWindow: true, active: true});
    const tab = activeTabs[0] as TabWithGroupId;
    const tabId = tab.id ?? -1;

    return {
        action: tabAction,
        tabId: tabId,
        tabUuid: openedTabsCache.get(tabId)?.tabUuid ?? uuid(),
        timeStamp: getUTCDateTime(),
        taskId: bgLoggingConstants.taskId,
        groupId: tab.groupId ?? -1,
        tabIndex: tab.index ?? -1,
        windowId: tab.windowId ?? -1,
        title: bookmark.title,
        url: bookmark.url ?? "",
    };
}

function handleSaveTabAfterNewTabOrNewUrl(tab: Tab, tabAction: TabAction, query?: string, searchEngineName?: SearchEngineName, serpIdentifier?: string) {
    const iTab = prePareITabFromTab(tab, tabAction, query, searchEngineName, serpIdentifier);
    dataBase.saveTabInfo(iTab);
    openedTabsCache.set(iTab.tabId, {url: iTab.url, tabUuid: iTab.tabUuid});
}

export async function handleLogExistingTabs() {

    const openedTabs = await tabs.query({})
    const loggedTabs: TabIdentifier[] = await dataBase.getTabsSinceYesterday();

    const tabsToLog = openedTabs.filter(filterOutLoggedTabs);

    addExistingTabsToCache(openedTabs);
    saveAllTabs(tabsToLog);


    function filterOutLoggedTabs(tab: Tab) {

        return !isTabLogged(tab);

        function isTabLogged(tab: Tab) {
            return loggedTabs.some(tabExists)

            function tabExists(loggedTab: TabIdentifier) {
                const sameId = loggedTab.tabId === tab.id;
                const sameUrl = loggedTab.url === tab.url;
                return sameId && sameUrl;
            }
        }

    }

    function saveAllTabs(tabs: Tab[]) {
        tabs.forEach(saveTab)

        function saveTab(tab: Tab) {
            const iTab = prePareITabFromTab(tab, "TAB:OLD");
            dataBase.saveTabInfo(iTab);
        }
    }

    function addExistingTabsToCache(tabsToLog: Tab[]) {
        tabsToLog.forEach(tab => {
            openedTabsCache.set(tab.id as number, {url: tab.url as string, tabUuid: uuid()});
        })
    }
}

export function setBadgeText(badgeText: BadgeText) {
    browser.action.setBadgeText({text: badgeText})
        .then(() => console.log("set badge to", badgeText))
        .catch(error => console.error("setBadgeText", error));
}

export function clearCache() {
    openedTabsCache.clear();
}

