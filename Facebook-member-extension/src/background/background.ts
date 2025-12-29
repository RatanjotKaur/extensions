import { appendRow } from "../utils/sheets";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SAVE_MEMBER") {
    // Keep the message channel open for async sendResponse
    (async () => {
      try {
        const payload = message.payload || {};

        // get spreadsheet id from storage (user should save this via popup or set in storage)
        const getResult = await new Promise<{ spreadsheetId?: string }>(
          (resolve) => chrome.storage.sync.get(["spreadsheetId"], resolve)
        );

        const spreadsheetId = getResult.spreadsheetId || "YOUR_SHEET_ID";

        await appendRow(spreadsheetId, [
          [
            payload.name || "",
            payload.profileUrl || "",
            payload.requestDate || new Date().toISOString(),
            payload.action || "",
          ],
        ]);

        sendResponse({ success: true });
      } catch (err: any) {
        console.error("Failed to save member:", err);
        sendResponse({ success: false, error: err?.message || String(err) });
      }
    })();

    return true;
  }
});
