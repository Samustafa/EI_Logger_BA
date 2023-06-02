import {
    AttachInfo,
    BadgeText,
    BookMark,
    DetachInfo,
    OnActivatedActiveInfoType,
    OnCompletedDetailsType,
    OnUpdatedChangeInfoType,
    RemoveInfo,
    Tab,
    TabAction,
    TabWithGroupId
} from "@pages/popup/Types";
import {ITab} from "@pages/popup/Interfaces";
import {dataBase} from "@pages/popup/database";
import browser, {tabs} from "webextension-polyfill";
import {getUTCDateTime} from "@pages/popup/UtilityFunctions";
import {bgLoggingConstants} from "@pages/background/BGLoggingConstants";


const openedTabsCache = new Map<number, string>();

export function handleOnInstalled() {
    setBadgeText('OFF');
    dataBase.setExtensionState('NOT_AUTHENTICATED');
}

export function handleOnCompleted(details: OnCompletedDetailsType) {
    const tabFinishedLoading = 0;
    if (details.frameId !== tabFinishedLoading) return

    tabs.get(details.tabId)
        .then(tab => handleSaveAfterNewTabOrNewUrl(tab, "TAB:CREATED"))
        .catch(e => console.error("handleOnCompleted " + JSON.stringify(e)));
}

export function handleTabUpdated(id: number, changeInfo: OnUpdatedChangeInfoType, tab: Tab) {

    const urlFromTabId = openedTabsCache.get(id);
    const isNewURL = (changeInfo.url !== undefined) && (urlFromTabId !== undefined) && (changeInfo.url !== urlFromTabId);

    if (isNewURL) handleSaveAfterNewTabOrNewUrl(tab, "TAB:URL_CHANGED")
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
        })
        .catch((e) => console.error("handleTabRemoved " + JSON.stringify(e)))
}

export function handleTabActivated(onActivatedActiveInfoType: OnActivatedActiveInfoType) {
    dataBase.getLastTabWithId(onActivatedActiveInfoType.tabId)
        .then((iTab) => {
            if (iTab) {
                dataBase.saveTabInfo(prePareITabFromITab(iTab, "TAB:ACTIVATED"))
            } else {
                tabs.get(onActivatedActiveInfoType.tabId).then(tab => handleSaveAfterNewTabOrNewUrl(tab, "TAB:CREATED"))
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
function prePareITabFromTab(tab: Tab, tabAction: TabAction): ITab {
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

function handleSaveAfterNewTabOrNewUrl(tab: Tab, tabAction: TabAction) {
    const iTab = prePareITabFromTab(tab, tabAction);
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

