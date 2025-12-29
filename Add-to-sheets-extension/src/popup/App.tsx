import React, { useEffect, useState } from "react";
import { launchGoogleAuth, getStoredToken } from "../utils/oauth";
import "./App.css";

function extractSpreadsheetId(urlOrId: string): string | null {
  const v = urlOrId.trim();
  const m = v.match(/\/d\/([a-zA-Z0-9-_]+)(?:\/|$)/);
  if (m && m[1]) return m[1];
  if (/^[a-zA-Z0-9-_]{20,}$/.test(v)) return v;
  return null;
}

export default function App() {
  const [sheetUrl, setSheetUrl] = useState("");
  const [sheetId, setSheetId] = useState<string | null>(null);
  const [verifyStatus, setVerifyStatus] = useState<string | null>(null);
  const [tagsInput, setTagsInput] = useState("");
  const [appendStatus, setAppendStatus] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    setSheetId(extractSpreadsheetId(sheetUrl));
  }, [sheetUrl]);

  useEffect(() => {
    // try load cached token from chrome.storage
    (async () => {
      const t = await getStoredToken();
      if (t) setAccessToken(t);
    })();
  }, []);

  async function handleSignIn() {
    setIsLoading(true);
    setVerifyStatus("Signing in...");
    try {
      const token = await launchGoogleAuth([
        "https://www.googleapis.com/auth/spreadsheets",
      ]);
      setAccessToken(token);
      setVerifyStatus("✅ Signed in successfully");
    } catch (err: any) {
      setVerifyStatus("❌ Sign-in failed: " + (err?.message || err));
    } finally {
      setIsLoading(false);
    }
  }

  function handleSignOut() {
    setAccessToken(null);
    chrome.storage.local.remove(["google_token"]);
    setVerifyStatus(null);
    setAppendStatus(null);
  }

  async function handleVerify() {
    setIsVerifying(true);
    setVerifyStatus("Verifying...");
    setAppendStatus(null);
    if (!sheetId) {
      setVerifyStatus("❌ Invalid sheet URL/ID");
      setIsVerifying(false);
      return;
    }
    if (!accessToken) {
      setVerifyStatus("❌ Not signed in. Please sign in first.");
      setIsVerifying(false);
      return;
    }
    try {
      const res = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(
          sheetId
        )}?fields=properties(title),sheets.properties(title)`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (!res.ok) {
        const txt = await res.text();
        setVerifyStatus(`❌ Verify failed: ${res.status} ${txt}`);
        setIsVerifying(false);
        return;
      }
      const json = await res.json();
      const title = json?.properties?.title || sheetId;
      const sheetNames = (json.sheets || []).map(
        (s: any) => s.properties.title
      );
      setVerifyStatus(
        `✅ Sheet verified: "${title}"\nSheets: ${sheetNames.join(", ")}`
      );
    } catch (err: any) {
      setVerifyStatus("❌ Error: " + (err?.message || err));
    } finally {
      setIsVerifying(false);
    }
  }

  async function handleAppend() {
    setAppendStatus("Appending...");
    if (!sheetId) {
      setAppendStatus("❌ Invalid sheet URL/ID");
      return;
    }
    if (!accessToken) {
      setAppendStatus("❌ Not signed in. Please sign in first.");
      return;
    }
    const tags = tagsInput
      .split(/[\n,;]+/)
      .map((t) => t.trim())
      .filter(Boolean);
    if (tags.length === 0) {
      setAppendStatus("❌ No tags to append");
      return;
    }

    const rows = tags.map((t) => [new Date().toISOString(), t]);
    const range = "Sheet1!A:B"; // change if you want different sheet/range

    try {
      const res = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(
          sheetId
        )}/values/${encodeURIComponent(
          range
        )}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ values: rows }),
        }
      );
      if (!res.ok) {
        const txt = await res.text();
        setAppendStatus(`❌ Append failed: ${res.status} ${txt}`);
        return;
      }
      setAppendStatus(`✅ Successfully appended ${rows.length} tag(s)`);
      setTagsInput("");
    } catch (err: any) {
      setAppendStatus("❌ Error: " + (err?.message || err));
    }
  }

  return (
    <div className="container">
      <header className="header">
        <h2 className="title">📊 Add to Google Sheets</h2>
        <p className="subtitle">Verify sheets and append tags</p>
      </header>

      <div className="auth-section">
        <button
          onClick={handleSignIn}
          disabled={isLoading || !!accessToken}
          className="btn btn-primary"
        >
          {isLoading ? "Signing in..." : "Sign in with Google"}
        </button>
        {accessToken && (
          <button onClick={handleSignOut} className="btn btn-secondary">
            Sign out
          </button>
        )}
      </div>

      {accessToken && <div className="status-badge">✅ Signed in</div>}

      {verifyStatus && (
        <div
          className={`status-message ${
            verifyStatus.includes("✅") ? "success" : "error"
          }`}
        >
          {verifyStatus}
        </div>
      )}

      <section className="section">
        <h3 className="section-title">Step 1: Verify Google Sheet</h3>
        <label className="label">Google Sheet URL or ID</label>
        <input
          value={sheetUrl}
          onChange={(e) => setSheetUrl(e.target.value)}
          placeholder="Paste sheet URL or ID here..."
          className="input-field"
          disabled={!accessToken}
        />
        <button
          onClick={handleVerify}
          disabled={!sheetUrl || !accessToken || isVerifying}
          className="btn btn-primary btn-block"
        >
          {isVerifying ? "Verifying..." : "Verify Sheet"}
        </button>
      </section>

      <section className="section">
        <h3 className="section-title">Step 2: Append Tags</h3>
        <label className="label">
          Tags (comma, semicolon, or newline separated)
        </label>
        <textarea
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          rows={5}
          placeholder="Enter tags here. Examples:&#10;tag1&#10;tag2&#10;tag3"
          className="textarea-field"
          disabled={!accessToken}
        />
        <button
          onClick={handleAppend}
          disabled={!tagsInput.trim() || !accessToken}
          className="btn btn-primary btn-block"
        >
          Append Tags to Sheet
        </button>
      </section>

      {appendStatus && (
        <div
          className={`status-message ${
            appendStatus.includes("✅") ? "success" : "error"
          }`}
        >
          {appendStatus}
        </div>
      )}

      <footer className="footer">
        <small>💡 Make sure your Google account has access to the sheet.</small>
      </footer>
    </div>
  );
}
