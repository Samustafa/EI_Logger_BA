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
    TabWithGroupId
} from "@pages/popup/Types";
import {ITab} from "@pages/popup/Interfaces";
import {dataBase} from "@pages/popup/database";
import browser, {tabs} from "webextension-polyfill";
import {getUTCDateTime, sendMessageToCS} from "@pages/popup/UtilityFunctions";
import {bgLoggingConstants} from "@pages/background/BGLoggingConstants";
import {queryKeyWords, searchEngineSerpInfos} from "@pages/popup/model/SearchEngineSerpInfo";


const openedTabsCache = new Map<number, string>();

export function handleOnInstalled() {
    setBadgeText('OFF');
    dataBase.setExtensionState('NOT_AUTHENTICATED');
}

export function handleOnCompleted(details: OnCompletedDetailsType) {
    const tabFinishedLoading = 0;
    if (details.frameId !== tabFinishedLoading) return

    tabs.get(details.tabId)
        .then(tab => logTabAndLogHtmlIfSerp(tab, "TAB:CREATED"))
        .catch(e => console.error("handleOnCompleted " + JSON.stringify(e)));
}

export function handleTabUpdated(id: number, changeInfo: OnUpdatedChangeInfoType, tab: Tab) {

    const urlFromTabId = openedTabsCache.get(id);
    const isNewURL = (changeInfo.url !== undefined) && (urlFromTabId !== undefined) && (changeInfo.url !== urlFromTabId);

    if (isNewURL) logTabAndLogHtmlIfSerp(tab, "TAB:URL_CHANGED")
    else if (changeInfo.pinned !== undefined) {
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
        .catch((e) => console.error("handleTabRemoved " + JSON.stringify(e)))
}

export function handleTabActivated(onActivatedActiveInfoType: OnActivatedActiveInfoType) {
    dataBase.getLastTabWithId(onActivatedActiveInfoType.tabId)
        .then((iTab) => {
            if (iTab) {
                dataBase.saveTabInfo(prePareITabFromITab(iTab, "TAB:ACTIVATED"))
            } else {
                tabs.get(onActivatedActiveInfoType.tabId).then(tab => handleSaveTabAfterNewTabOrNewUrl(tab, "TAB:CREATED"))
            }

        })
        .catch((e) => console.error("handleTabActivated " + e))

}

export function handleBookmarkCreated(id: string, bookmark: BookMark) {
    const iTab = prepareITabFromBookMark(bookmark, "TAB:BOOKMARK:ADDED");
    dataBase.saveTabInfo(iTab);
}

export function handleBookmarkRemoved(id: string, removeInfo: RemoveInfo) {
    const iTab = prepareITabFromBookMark(removeInfo.node, "TAB:BOOKMARK:REMOVED");
    dataBase.saveTabInfo(iTab);
}

export async function handleTabAttached(tabId: number, attachInfo: AttachInfo) {
    const tab = await tabs.get(tabId);
    const iTab: ITab = {
        action: "TAB:ATTACHED:TO:WINDOW",
        groupId: -1,
        studyId: bgLoggingConstants.studyId,
        tabId: tabId,
        tabIndex: attachInfo.newPosition,
        taskId: bgLoggingConstants.taskId,
        timeStamp: getUTCDateTime(),
        title: tab?.title ?? "",
        url: tab?.url ?? "",
        userId: bgLoggingConstants.userId,
        windowId: attachInfo.newWindowId,
    };
    console.log("attached tab -->", iTab);
    dataBase.saveTabInfo(iTab);
}

export async function handleTabDetached(tabId: number, detachInfo: DetachInfo) {
    const tab = await tabs.get(tabId);
    const iTab: ITab = {
        action: "TAB:DETACHED:FROM:WINDOW",
        groupId: -1,
        studyId: bgLoggingConstants.studyId,
        tabId: tabId,
        tabIndex: detachInfo.oldPosition,
        taskId: bgLoggingConstants.taskId,
        timeStamp: getUTCDateTime(),
        title: tab?.title ?? "",
        url: tab?.url ?? "",
        userId: bgLoggingConstants.userId,
        windowId: detachInfo.oldWindowId,
    }
    dataBase.saveTabInfo(iTab);
}


//Helper Functions
function logTabAndLogHtmlIfSerp(tab: Tab, tabAction: TabAction) {

    const {query, searchEngineName} = getSeNameAndQueryIfSerp(tab.url as string, tab.id as number);

    handleSaveTabAfterNewTabOrNewUrl(tab, tabAction, query, searchEngineName);

    const isSerp = !!query && !!searchEngineName
    if (!isSerp) return;

    logHtmlOfSerp();

    function getSeNameAndQueryIfSerp(url: string, tabId: number): QueryAndSearchEngineName {

        let queryKeyWord: QueryKeyWord | undefined = undefined;

        getQueryKeyWordIfExists(url);

        if (!queryKeyWord) return {query: undefined, searchEngineName: undefined};

        return extractSeNameAndQuery(url, tabId, queryKeyWord);

        function getQueryKeyWordIfExists(url: string) {
            queryKeyWords.some(keyword => {
                console.log("trying ", keyword)
                const isQuery = url.includes(keyword);

                if (!isQuery) return false;

                console.log("bingo");
                queryKeyWord = keyword;
                return true;
            });
        }

        function extractSeNameAndQuery(url: string, tanId: number, queryKeyWord: QueryKeyWord): QueryAndSearchEngineName {
            let query: string | undefined = undefined;
            let searchEngineName: SearchEngineName | undefined = undefined;
            searchEngineSerpInfos.get(queryKeyWord)?.some((searchEngineSerpInfo) => {
                const isSerp = searchEngineSerpInfo.isUrlSERP(url);
                console.log("isSerp: " + isSerp)

                if (!isSerp) return false;

                console.log("")
                query = searchEngineSerpInfo.getQuery(url);
                searchEngineName = searchEngineSerpInfo.searchEngineName;
                console.log(query)
                return true;
            })
            return {query, searchEngineName};
        }
    }

    function logHtmlOfSerp() {
        sendMessageToCS(tab.id as number, "LOG_HTML_OF_SERP");
    }
}

function prePareITabFromTab(tab: Tab, tabAction: TabAction, query?: string, searchEngineName?: SearchEngineName): ITab {
    const tabExtended = tab as TabWithGroupId;

    return {
        action: tabAction,
        timeStamp: getUTCDateTime(),
        userId: bgLoggingConstants.userId,
        studyId: bgLoggingConstants.studyId,
        taskId: bgLoggingConstants.taskId,
        groupId: tabExtended.groupId,
        tabId: tab?.id ?? -1,
        tabIndex: tab.index,
        windowId: tab?.windowId ?? -1,
        title: tab?.title ?? "",
        url: tab?.pendingUrl ?? tab?.url ?? "",
        query: query,
        searchEngineName: searchEngineName,
    }
}

function prePareITabFromITab(tab: ITab, tabAction: TabAction): ITab {

    return {
        action: tabAction,
        timeStamp: getUTCDateTime(),
        userId: bgLoggingConstants.userId,
        studyId: bgLoggingConstants.studyId,
        taskId: bgLoggingConstants.taskId,
        groupId: tab.groupId,
        tabId: tab.tabId,
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
function prepareITabFromBookMark(bookmark: BookMark, tabAction: "TAB:BOOKMARK:REMOVED" | "TAB:BOOKMARK:ADDED"): ITab {
    return {
        action: tabAction,
        timeStamp: getUTCDateTime(),
        userId: bgLoggingConstants.userId,
        studyId: bgLoggingConstants.studyId,
        taskId: bgLoggingConstants.taskId,
        groupId: -1,
        tabId: -1,
        tabIndex: -1,
        windowId: -1,
        title: bookmark.title,
        url: bookmark.url ?? "",
    }
}

function handleSaveTabAfterNewTabOrNewUrl(tab: Tab, tabAction: TabAction, query?: string, searchEngineName?: SearchEngineName) {
    const iTab = prePareITabFromTab(tab, tabAction, query, searchEngineName);
    dataBase.saveTabInfo(iTab);
    openedTabsCache.set(iTab.tabId, iTab.url)
}

export function handleLogAllExistingTabs() {
    tabs.query({}).then((tabs) => {
        tabs.forEach((tab) => {
            const iTab = prePareITabFromTab(tab, "TAB:OLD");
            dataBase.saveTabInfo(iTab);
        })
    })
}

export function setBadgeText(badgeText: BadgeText) {
    browser.action.setBadgeText({text: badgeText}).then(() => console.log("set badge to", badgeText));
}

