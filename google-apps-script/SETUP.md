# Registration → Google Sheets Setup

Data flow (no backend, ever):

```
Next.js frontend  →  Google Apps Script Web App  →  Google Sheet
```

## 1. Create the spreadsheet

1. Create a new Google Sheet.
2. Copy its **Spreadsheet ID** from the URL:
   `https://docs.google.com/spreadsheets/d/`**`THIS_LONG_ID`**`/edit`
3. You do **not** need to add headers manually — the script writes them on the
   first submission.

## 2. Deploy the Apps Script

1. In the sheet: **Extensions ▸ Apps Script**.
2. Delete the boilerplate and paste the contents of [`Code.gs`](./Code.gs).
3. **Deploy ▸ New deployment**.
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Authorize when prompted.
5. Copy the **Web app URL** (ends in `/exec`).

> Re-deploying: after editing `Code.gs`, use **Deploy ▸ Manage deployments ▸
> edit ▸ Version: New version** so the live URL runs the latest code.

## 3. Configure environment variables

Copy `.env.example` to **`.env.local`** in the project root and fill in:

```bash
NEXT_PUBLIC_GOOGLE_SPREADSHEET_ID=<paste Spreadsheet ID>
NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL=<paste Web app URL ending in /exec>
NEXT_PUBLIC_REGISTRATION_SHEET_NAME=Registrations
```

On Vercel, add the same three variables under **Project Settings ▸ Environment
Variables** and redeploy. Switching spreadsheets = change the env vars only.

## 4. Verify

Submit the form once. The first submission automatically:

- writes the header row and freezes it,
- styles headers (bold, white text on dark navy `#0B1F4D`, centered),
- enables filters, alternating row colors, and auto-sized columns,
- appends the workflow columns (Registration Status, Payment Status, Committee
  Allocation, Application Reviewed, Email Sent, Remarks) with default values,
- adds conditional formatting for the status columns.

Every registration gets a sequential ID (`NM2026-0001`, `NM2026-0002`, …).
Submitting the **same email for the same committee** twice is rejected as a
duplicate. Formatting is applied **once** and never overwritten afterwards.
