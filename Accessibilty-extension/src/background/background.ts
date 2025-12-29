chrome.runtime.onInstalled.addListener(() => {
  console.log("Accessibility Toolkit installed");
});

// Apply stored settings to newly activated tabs
chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.storage.sync.get("settings", (data) => {
    if (!data.settings) return;
    chrome.tabs.sendMessage(activeInfo.tabId, data.settings, () => {
      if (chrome.runtime.lastError) {
        // Suppress expected errors on pages without content script
      }
    });
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    chrome.storage.sync.get("settings", (data) => {
      if (!data.settings) return;
      chrome.tabs.sendMessage(tabId, data.settings, () => {
        if (chrome.runtime.lastError) {
          // Suppress expected errors on pages without content script
        }
      });
    });
  }
});
