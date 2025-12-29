import { useEffect, useState } from "react";

export default function Popup() {
  const [spreadsheetId, setSpreadsheetId] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    chrome.storage.sync.get(["spreadsheetId"], (res) => {
      if (res?.spreadsheetId) setSpreadsheetId(res.spreadsheetId);
    });
  }, []);

  function save() {
    chrome.storage.sync.set({ spreadsheetId }, () => {
      setStatus("Saved");
      setTimeout(() => setStatus(""), 1500);
    });
  }

  return (
    <div style={{ padding: 10, width: 300 }}>
      <h3>FB Member Logger</h3>
      <div style={{ marginBottom: 8 }}>
        <label style={{ display: "block", fontSize: 12, marginBottom: 4 }}>
          Spreadsheet ID
        </label>
        <input
          value={spreadsheetId}
          onChange={(e) =>
            setSpreadsheetId((e.target as HTMLInputElement).value)
          }
          style={{ width: "100%", padding: 6 }}
        />
      </div>
      <button onClick={save} style={{ padding: "6px 10px" }}>
        Save
      </button>
      <div style={{ marginTop: 8 }}>{status}</div>
      <hr />
      <p style={{ fontSize: 12 }}>
        Open Member Requests page and click buttons.
      </p>
    </div>
  );
}
