<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

Single service: a Next.js 16 app (GiSwap, a BJJ gi marketplace). Standard commands live in `package.json` (`dev`, `build`, `lint`, `db:*`). Run the dev server with `npm run dev` (Turbopack, http://localhost:3000).

Non-obvious caveats:
- `prisma.config.ts` loads env via `dotenv/config`, which only reads `.env` (NOT `.env.local`). Prisma CLI commands (and the `postinstall`/`build` `prisma generate`) throw "Missing DIRECT_URL" unless `.env` exists. The startup update script copies `.env.example` to `.env`; the dev server reads both `.env` and `.env.local`.
- The database is a hosted Neon Postgres with credentials committed in `.env.example`; the schema is already applied (verify with `npx prisma migrate status`). There is no local Postgres to start.
- Auth is Google OAuth only (`next-auth` v5, see `auth.ts`). Public browsing and `GET /api/listings` work without auth, but authenticated flows (posting a gi via the UI, messaging, dashboard) require a Google login whose redirect URI is not configured for localhost, so they can't be exercised end-to-end in cloud. To verify DB writes, create rows directly via Prisma using `lib/prisma.ts`'s Neon adapter.
- Optional integrations are inert by default and not needed to run/browse: UploadThing image uploads (`UPLOADTHING_TOKEN` empty), Pusher realtime messaging, and Resend email.
- Known pre-existing defect (not an environment issue): `app/profile/messages/page.tsx` contains an API route handler with no default export, so `npm run build` fails type-checking on that route. `npm run dev` is unaffected.
