This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Google Sheets Registration Setup

Delegate registrations are submitted straight from the browser to a **Google
Apps Script Web App**, which appends a row to a **Google Sheet**. There is no
custom backend — the app stays fully static/serverless and deployable on Vercel.

```
Next.js frontend  →  Google Apps Script Web App  →  Google Sheet
```

Setup takes under 5 minutes:

1. **Create a Google Sheet** (a blank one is fine — headers are generated
   automatically on the first submission).
2. In the sheet, open **Extensions → Apps Script**.
3. Delete the boilerplate and **paste the contents of
   [`google-apps-script/Code.gs`](./google-apps-script/Code.gs)**.
4. Click **Deploy → New deployment** and choose type **Web app**.
5. Set **Execute as → Me**.
6. Set **Who has access → Anyone**, then **Deploy** and authorize when prompted.
7. **Copy the Spreadsheet ID** from the sheet URL:
   `https://docs.google.com/spreadsheets/d/`**`<SPREADSHEET_ID>`**`/edit`
8. **Copy the Web App URL** (it ends in `/exec`).
9. **Create `.env.local`** in the project root (copy it from `.env.example`).
10. Fill it in:

    ```bash
    NEXT_PUBLIC_GOOGLE_SPREADSHEET_ID=<paste Spreadsheet ID>
    NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL=<paste Web App URL ending in /exec>
    NEXT_PUBLIC_REGISTRATION_SHEET_NAME=Registrations
    ```

11. Install dependencies:

    ```bash
    npm install
    ```

12. Start the dev server:

    ```bash
    npm run dev
    ```

Submit the form once to verify a new formatted row appears in the
**Registrations** tab. The first submission also styles the header, enables
filters, adds workflow/status columns, and sets up conditional formatting —
all automatically and only once. For full details see
[`google-apps-script/SETUP.md`](./google-apps-script/SETUP.md).

> **Production (Vercel):** add the same three `NEXT_PUBLIC_…` variables under
> **Project Settings → Environment Variables**, then redeploy.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
