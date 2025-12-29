console.log("Content Script Loaded (TS)");

chrome.runtime.sendMessage({ action: "CONTENT_LOADED" }, (res) => {
  console.log("Background replied:", res);
});
