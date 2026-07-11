/**
 * NEETI MUN — Registration → Google Sheets endpoint.
 *
 * The Next.js frontend POSTs JSON of the shape:
 *   { spreadsheetId, sheetName, record: { "Header": "value", ... } }
 *
 * Responsibilities:
 *   • Schema-agnostic: writes headers from the record's keys, and appends a new
 *     column automatically for any key it has not seen before.
 *   • Owns workflow columns (status/payment/etc.) with sensible defaults.
 *   • Assigns sequential registration IDs (NM2026-0001, NM2026-0002, …).
 *   • Rejects duplicates (same Email AND same Committee).
 *   • Applies premium formatting + conditional formatting exactly once.
 *
 * Deploy:  Extensions ▸ Apps Script ▸ paste this ▸ Deploy ▸ New deployment ▸
 *          type "Web app" ▸ Execute as "Me" ▸ Who has access "Anyone".
 */

/* ─── Configuration ──────────────────────────────────────────────────────── */

const DEFAULT_SHEET_NAME = "Registrations";

const REGISTRATION_ID_COLUMN = "Registration ID";
const REGISTRATION_ID_PREFIX = "NM2026";
const REGISTRATION_ID_PAD = 4;

// Script-property keys — persist across executions and row deletions.
const PROP_SEQUENCE = "registrationSequence";
const PROP_FORMAT_INITIALIZED_PREFIX = "formatInitialized:";

// A duplicate exists when ALL of these columns match an existing row.
// Change this array if the business rule changes (e.g. email-only).
const DUPLICATE_MATCH_COLUMNS = ["Email", "Committee"];

// Workflow columns appended after the data columns, with their defaults.
const WORKFLOW_COLUMNS = [
  { name: "Registration Status", defaultValue: "Pending" },
  { name: "Payment Status", defaultValue: "Pending" },
  { name: "Committee Allocation", defaultValue: "Not Assigned" },
  { name: "Application Reviewed", defaultValue: "No" },
  { name: "Email Sent", defaultValue: "No" },
  { name: "Remarks", defaultValue: "" },
];

// Header appearance (applied once, on first creation).
const HEADER_STYLE = { background: "#0B1F4D", fontColor: "#FFFFFF" };

// Soft status colours reused by the conditional formatting rules.
const COLOR = {
  green: "#D4EDDA",
  red: "#F8D7DA",
  yellow: "#FFF3CD",
  orange: "#FFE5B4",
  gray: "#E2E3E5",
};

// Conditional formatting: column name → list of { value, background }.
const CONDITIONAL_RULES = {
  "Registration Status": [
    { value: "Pending", background: COLOR.yellow },
    { value: "Approved", background: COLOR.green },
    { value: "Rejected", background: COLOR.red },
    { value: "Waitlisted", background: COLOR.orange },
  ],
  "Payment Status": [
    { value: "Pending", background: COLOR.orange },
    { value: "Paid", background: COLOR.green },
  ],
  "Application Reviewed": [
    { value: "Yes", background: COLOR.green },
    { value: "No", background: COLOR.red },
  ],
  "Email Sent": [
    { value: "Yes", background: COLOR.green },
    { value: "No", background: COLOR.gray },
  ],
};

/* ─── Web app entry points ───────────────────────────────────────────────── */

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000); // serialise concurrent submissions to avoid races

  try {
    const body = JSON.parse(e.postData.contents);
    const record = body.record || {};

    const ss = body.spreadsheetId
      ? SpreadsheetApp.openById(body.spreadsheetId)
      : SpreadsheetApp.getActiveSpreadsheet();
    const sheet = getOrCreateSheet_(ss, body.sheetName || DEFAULT_SHEET_NAME);

    const headers = syncHeaders_(sheet, record);
    initializeFormattingOnce_(sheet, headers);

    if (isDuplicate_(sheet, headers, record)) {
      return jsonOutput_({
        success: false,
        message: "You have already registered for this committee.",
      });
    }

    const registrationId = getNextRegistrationId_(sheet, headers);
    Logger.log("Generated registrationId: %s", registrationId);

    sheet.appendRow(buildRow_(headers, record, registrationId));

    // The value written into the sheet and the value returned to the client are
    // the SAME variable — one source of truth.
    const responsePayload = {
      success: true,
      registrationId: registrationId,
      message: "Registration submitted successfully.",
      timestamp: new Date().toISOString(),
    };
    Logger.log("Returning: %s", JSON.stringify(responsePayload));
    return jsonOutput_(responsePayload);
  } catch (err) {
    return jsonOutput_({ success: false, message: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return jsonOutput_({
    success: true,
    message: "NEETI MUN registration endpoint is live.",
  });
}

/* ─── Sheet + header helpers ─────────────────────────────────────────────── */

function getOrCreateSheet_(ss, name) {
  return ss.getSheetByName(name) || ss.insertSheet(name);
}

function readHeaders_(sheet) {
  const lastColumn = sheet.getLastColumn();
  if (lastColumn === 0) return [];
  return sheet
    .getRange(1, 1, 1, lastColumn)
    .getValues()[0]
    .filter(function (value) {
      return value !== "" && value !== null;
    });
}

function writeHeaders_(sheet, headers) {
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
}

function dedupe_(values) {
  const seen = {};
  const result = [];
  values.forEach(function (value) {
    if (!seen[value]) {
      seen[value] = true;
      result.push(value);
    }
  });
  return result;
}

/**
 * Ensures the header row contains every record key plus every workflow column,
 * appending any that are missing. Never duplicates or reorders existing
 * columns. Returns the resulting header list.
 */
function syncHeaders_(sheet, record) {
  const workflowNames = WORKFLOW_COLUMNS.map(function (column) {
    return column.name;
  });
  const required = dedupe_(Object.keys(record).concat(workflowNames));

  let headers = readHeaders_(sheet);
  if (headers.length === 0) {
    writeHeaders_(sheet, required);
    return required;
  }

  const missing = required.filter(function (name) {
    return headers.indexOf(name) === -1;
  });
  if (missing.length) {
    headers = headers.concat(missing);
    writeHeaders_(sheet, headers);
  }
  return headers;
}

/* ─── One-time formatting ────────────────────────────────────────────────── */

function initializeFormattingOnce_(sheet, headers) {
  const properties = PropertiesService.getScriptProperties();
  const key = PROP_FORMAT_INITIALIZED_PREFIX + sheet.getSheetId();
  if (properties.getProperty(key)) return; // never re-format after first run

  const columnCount = headers.length;

  sheet
    .getRange(1, 1, 1, columnCount)
    .setBackground(HEADER_STYLE.background)
    .setFontColor(HEADER_STYLE.fontColor)
    .setFontWeight("bold")
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle");

  sheet.setFrozenRows(1);

  if (!sheet.getFilter()) {
    sheet.getRange(1, 1, sheet.getMaxRows(), columnCount).createFilter();
  }

  if (sheet.getBandings().length === 0 && sheet.getMaxRows() > 1) {
    sheet
      .getRange(2, 1, sheet.getMaxRows() - 1, columnCount)
      .applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY, false, false);
  }

  sheet.autoResizeColumns(1, columnCount);
  applyConditionalFormatting_(sheet, headers);

  properties.setProperty(key, "true");
}

function applyConditionalFormatting_(sheet, headers) {
  const rules = sheet.getConditionalFormatRules();
  const rowCount = sheet.getMaxRows() - 1;

  Object.keys(CONDITIONAL_RULES).forEach(function (columnName) {
    const columnIndex = headers.indexOf(columnName);
    if (columnIndex === -1) return;

    const range = sheet.getRange(2, columnIndex + 1, rowCount, 1);
    CONDITIONAL_RULES[columnName].forEach(function (spec) {
      rules.push(
        SpreadsheetApp.newConditionalFormatRule()
          .whenTextEqualTo(spec.value)
          .setBackground(spec.background)
          .setRanges([range])
          .build(),
      );
    });
  });

  sheet.setConditionalFormatRules(rules);
}

/* ─── Duplicate detection ────────────────────────────────────────────────── */

function normalize_(value) {
  return String(value == null ? "" : value)
    .trim()
    .toLowerCase();
}

function isDuplicate_(sheet, headers, record) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return false;

  const matchIndexes = DUPLICATE_MATCH_COLUMNS.map(function (name) {
    return headers.indexOf(name);
  });
  if (
    matchIndexes.some(function (index) {
      return index === -1;
    })
  ) {
    return false; // a matcher column is absent — cannot be a duplicate
  }

  const data = sheet.getRange(2, 1, lastRow - 1, headers.length).getValues();
  return data.some(function (row) {
    return DUPLICATE_MATCH_COLUMNS.every(function (name, i) {
      return normalize_(row[matchIndexes[i]]) === normalize_(record[name]);
    });
  });
}

/* ─── Sequential registration IDs ────────────────────────────────────────── */

function formatRegistrationId_(sequence) {
  let padded = String(sequence);
  while (padded.length < REGISTRATION_ID_PAD) padded = "0" + padded;
  return REGISTRATION_ID_PREFIX + "-" + padded;
}

/**
 * Returns the next ID (e.g. "NM2026-0001"). Backed by a persisted counter, so
 * IDs are always unique and monotonically increasing — even if rows are
 * deleted. Seeds from the highest existing ID the first time it runs against a
 * populated sheet.
 */
function getNextRegistrationId_(sheet, headers) {
  const properties = PropertiesService.getScriptProperties();
  const stored = properties.getProperty(PROP_SEQUENCE);

  let current;
  if (stored === null) {
    current = highestExistingSequence_(sheet, headers);
  } else {
    current = parseInt(stored, 10);
    if (isNaN(current)) current = 0;
  }

  const next = current + 1;
  properties.setProperty(PROP_SEQUENCE, String(next));
  return formatRegistrationId_(next);
}

function highestExistingSequence_(sheet, headers) {
  const idIndex = headers.indexOf(REGISTRATION_ID_COLUMN);
  const lastRow = sheet.getLastRow();
  if (idIndex === -1 || lastRow < 2) return 0;

  const ids = sheet.getRange(2, idIndex + 1, lastRow - 1, 1).getValues();
  let max = 0;
  ids.forEach(function (row) {
    const match = String(row[0]).match(/(\d+)\s*$/);
    if (match) {
      const value = parseInt(match[1], 10);
      if (value > max) max = value;
    }
  });
  return max;
}

/* ─── Row building ───────────────────────────────────────────────────────── */

function buildRow_(headers, record, registrationId) {
  const workflowDefaults = {};
  WORKFLOW_COLUMNS.forEach(function (column) {
    workflowDefaults[column.name] = column.defaultValue;
  });

  return headers.map(function (header) {
    if (header === REGISTRATION_ID_COLUMN) return registrationId;
    if (Object.prototype.hasOwnProperty.call(record, header)) {
      return record[header];
    }
    if (Object.prototype.hasOwnProperty.call(workflowDefaults, header)) {
      return workflowDefaults[header];
    }
    return "";
  });
}

/* ─── Response helper ────────────────────────────────────────────────────── */

function jsonOutput_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
