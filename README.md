# Unipile Inbox MVP (Next.js + TypeScript + MongoDB)

Real‑time unified inbox (LinkedIn + Gmail) using **Unipile Webhooks**.

## Features
- Hosted Auth flow to connect LinkedIn + Gmail
- **Webhooks**: New messages (LinkedIn) + New email (Gmail) → stored in MongoDB
- Minimal Inbox UI with filters + quick reply
- Webhook verification using `Unipile-Auth` header

## Setup
1. Copy `.env.example` → `.env.local` and fill values.
2. Install & run:
   ```bash
   npm i
   npm run dev
   ```

## Create Webhooks (Dashboard or API)
Create two webhooks pointing to `https://<your-domain>/api/webhooks/unipile`:
- **Messaging** (LinkedIn DMs) – choose events for new messages
- **Mailing** (Gmail) – choose events for new emails

**Optional (recommended)**: Set a header `Unipile-Auth: <your secret>` on the webhook and set the same value in `.env.local` as `UNIPILE_WEBHOOK_SECRET`.

Unipile retries up to 5 times if your endpoint doesn't return HTTP 200 within 30s.

## Hosted Auth
The app generates a Hosted Auth link for providers (LinkedIn/Google) and redirects the user.
On success, Unipile can also call your `UNIPILE_NOTIFY_URL` with `{status, account_id, name}` so you can match accounts in your DB.

## Notes
- This MVP uses webhooks to ingest messages; a "backfill" endpoint can be added later if needed.
- Next.js route runtime is Node.js (required for the SDK).
