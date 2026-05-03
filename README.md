# 💀 Dead Man's Vault


**version 2.0:** [https://v0-dead-man-s-vault.vercel.app/dashboard](https://v0-dead-man-s-vault.vercel.app/dashboard)
A privacy-first, zero-knowledge application designed to securely store and automatically release sensitive information upon specific trigger conditions (death, arrest, missing status).

## Overview
Dead Man's Vault is built to ensure the server never sees your plaintext data or your encryption keys. Data is encrypted entirely on the client side using `libsodium` before being stored. Access is controlled by an escalating heartbeat switch mechanism.

### Key Features (MVP)
- **Zero-Knowledge Architecture:** Client-side encryption ensures ultimate privacy.
- **Dead Man Switch:** Customizable inactivity timers (Heartbeats).
- **Escalation Protocol:** Automated email and SMS warnings before release.
- **Emergency Contacts:** Multi-signature confirmation required for data release.
- **Audit Logs:** Immutable tracking of all interactions.

## Tech Stack
- Next.js 14+ (App Router)
- Tailwind CSS
- Vercel (Hosting)

*(Phase 2 additions will include Clerk for Auth and Supabase for DB).*

## Running Locally

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
