# GiSwap - BJJ Gi Marketplace

A marketplace built for the Jiu-Jitsu community to buy and sell new, used, and reclaimed BJJ gis.

## Features
- Browse & filter gi listings
- Post your own gis for sale
- Direct messaging between buyers and sellers
- Built with Next.js 15, TypeScript, Tailwind, Prisma

## Tech Stack
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- Prisma + PostgreSQL
- NextAuth.js (coming)

## Database (Neon)

1. Create a project at [neon.tech](https://neon.tech).
2. Copy **Pooled connection** → `DATABASE_URL` and **Direct connection** → `DIRECT_URL`.
3. Copy `.env.example` to `.env.local` and paste both URLs.
4. Apply the schema:

```bash
npm run db:migrate
```

For Vercel, add these in **Project → Settings → Environment Variables** (Production and Preview):

| Variable | Required for sign-in |
|----------|---------------------|
| `DATABASE_URL` | Yes |
| `DIRECT_URL` | Yes |
| `AUTH_SECRET` | Yes — generate with `openssl rand -hex 32` |
| `GOOGLE_CLIENT_ID` | Yes |
| `GOOGLE_CLIENT_SECRET` | Yes |

In Google Cloud Console, add authorized redirect URI: `https://giswap.vercel.app/api/auth/callback/google` (and preview URLs if testing preview deploys).

Migrations run automatically during `npm run build`.

## Getting Started

```bash
npm install
cp .env.example .env.local   # then fill in Neon + auth values
npm run db:migrate
npm run dev