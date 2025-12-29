const SECRET = "REPLACE_WITH_A_RANDOM_SECRET"; // change this

function doGet(e) {
  const action = e.parameter.action;
  const sheetId = e.parameter.sheetId;
  if (action === "verify") {
    return ContentService.createTextOutput(
      JSON.stringify(verifySheet(sheetId))
    ).setMimeType(ContentService.MimeType.JSON);
  }
  return ContentService.createTextOutput(
    JSON.stringify({ ok: false, error: "invalid_get" })
  ).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    if (data.secret && data.secret !== SECRET) {
      return ContentService.createTextOutput(
        JSON.stringify({ ok: false, error: "bad_secret" })
      ).setMimeType(ContentService.MimeType.JSON);
    }
    if (data.action === "append") {
      return ContentService.createTextOutput(
        JSON.stringify(appendTags(data.sheetId, data.tags))
      ).setMimeType(ContentService.MimeType.JSON);
    }
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: "unknown_action" })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: err.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function verifySheet(sheetId) {
  try {
    const ss = SpreadsheetApp.openById(sheetId);
    const title = ss.getName();
    const sheetNames = ss.getSheets().map((s) => s.getName());
    return { ok: true, title, sheetNames };
  } catch (err) {
    return { ok: false, error: err.toString() };
  }
}

function appendTags(sheetId, tags) {
  try {
    const ss = SpreadsheetApp.openById(sheetId);
    const sheet = ss.getSheets()[0]; // append to first sheet; change logic if you want specific sheet
    // Append each tag on its own row in column A with timestamp
    const rows = tags.map((t) => [new Date(), t]);
    sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, 2).setValues(rows);
    return { ok: true, appendedRows: rows.length };
  } catch (err) {
    return { ok: false, error: err.toString() };
  }
}
