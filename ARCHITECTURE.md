# Architecture Note — Ajaia Docs

## Product slice

I treated this as a **usable collaborative docs MVP**, not a Google Docs clone.

Prioritized:

1. Coherent create → edit → save → reopen loop
2. Rich-text editing that feels intentional (TipTap)
3. Product-relevant file import (`.txt` / `.md` / `.docx` → editable doc)
4. Clear ownership + sharing model with visible owned vs shared lists
5. Durable persistence and a deployable full-stack path
6. Stretch only after core worked: **role-based sharing**, **version history**, **Markdown export**

Intentionally deprioritized:

- Real-time CRDT collaboration / presence cursors
- Comments / suggestion mode
- Offline sync, conflict resolution, org-level ACL
- Pixel-perfect Google Docs layout/pagination
- Email invites or production identity provider

## Stack

| Layer | Choice | Why |
| --- | --- | --- |
| App | Next.js 14 App Router | One deployable full-stack surface, fast to ship |
| UI | React + Tailwind | Clean, maintainable UI without a heavy design system |
| Editor | TipTap | Mature rich-text primitives (bold/italic/underline/headings/lists) |
| API | Next.js Route Handlers | Low ceremony CRUD + auth endpoints |
| Auth | Cookie JWT (`jose`) + seeded users | Enough to demo sharing without OAuth scope |
| DB | MongoDB Atlas via Prisma | Shared free cloud DB for local + deploy; no local DB install |
| Import | mammoth + lightweight markdown/plain converters | Practical file → document path |
| Export | Turndown | Stretch: Markdown download |
| Tests | Vitest | Fast unit coverage for import + permissions |

## Data model

- `User` — seeded demo accounts
- `Document` — title + HTML content + owner
- `DocumentShare` — per-user `viewer` / `editor` role
- `DocumentVersion` — checkpoints for restore
- `Attachment` — metadata for imported source files

Access rules:

- **Owner**: edit, share, delete
- **Editor**: edit, save versions, restore, export
- **Viewer**: read + export only

## Key flows

1. **Login** → session cookie → dashboard split into Owned / Shared
2. **New document** or **Import file** → TipTap editor with autosave
3. **Share by email** against seeded users → role badge + permission enforcement
4. **Save version / restore** → explicit history without rebuilding OT/CRDT
5. **Export MD** → downloadable Markdown snapshot

## Tradeoffs

- HTML storage is pragmatic for TipTap fidelity in this timebox. A structured JSON doc model would be better long-term for migrations and collaborative ops.
- Autosave updates the live document; explicit “Save version” creates history entries to avoid noisy version spam.
- MongoDB Atlas is used for both local and production so reviewers and deploys share one persistence story. Network Access must allow Vercel (`0.0.0.0/0`) and your laptop IP.
- Auth is intentionally lightweight. It proves sharing logic without pretending to be enterprise IAM.

## What I’d build next (2–4 hours)

1. Neon Postgres + Vercel production hardening
2. Presence indicators (who is viewing) without full CRDT
3. Stronger import fidelity for complex `.docx`
4. Soft-delete + trash for documents
5. Share-by-link tokens for anonymous viewers
