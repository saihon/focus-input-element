import { StorageLocal } from "./storageLocal";

function onInstalledListener(details) {
    if (details.reason != "install") return;
    StorageLocal.init();
}

chrome.runtime.onInstalled.addListener(onInstalledListener);
