# Ajaia Docs

Lightweight collaborative document editor built for the **Ajaia AI-Native Full Stack Developer Assignment**.

## What works

- Create, rename, edit, autosave, and reopen documents
- Rich text: bold, italic, underline, H1/H2, bulleted + numbered lists
- Import `.txt`, `.md`, `.docx` (max 2MB) into a new editable document
- Sharing with **owner / editor / viewer** roles
- Clear Owned vs Shared document lists
- Persistence via MongoDB Atlas + Prisma
- Stretch: document version history + Markdown export
- Automated tests for import conversion and permission helpers

## Demo accounts

| Email | Password | Role on Welcome doc |
| --- | --- | --- |
| `alice@ajaia.dev` | `password123` | Owner |
| `bob@ajaia.dev` | `password123` | Editor |
| `cara@ajaia.dev` | `password123` | Viewer |

## Local setup

Requirements: Node.js 18+ and npm.

```bash
cd ajaia-collab-docs
cp .env.example .env
# Set DATABASE_URL to your MongoDB Atlas connection string (db: ajaia_docs)
npm install
npm run setup
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The app uses **MongoDB Atlas** for both local and production. Ensure your Atlas Network Access allows your current IP (and `0.0.0.0/0` for Vercel).

### Useful scripts

```bash
npm run dev        # start app
npm test           # run Vitest suite
npm run db:reset   # wipe + reseed demo data
npm run build      # production build
npm start          # serve production build
```

## Suggested review path (3 minutes)

1. Sign in as **Alice**
2. Open **Welcome to Ajaia Docs**
3. Edit text, use toolbar formatting, wait for autosave
4. Share with Cara as viewer (already seeded) or adjust Bob’s role
5. Sign out → sign in as **Bob** → confirm Shared list + edit access
6. Sign in as **Cara** → confirm read-only
7. Import `samples/product-brief.md`
8. Click **Export MD** and/or restore a version

## Supported uploads

- `.txt` — plain text → paragraphs
- `.md` — lightweight Markdown → headings/lists/inline marks
- `.docx` — converted with mammoth
- Max size: **2MB** (stated in UI)

## Free deployment (recommended)

**Best free path for reviewers:** Vercel (app) + MongoDB Atlas — both free tiers.

See `DEPLOYMENT.md` for step-by-step instructions.

After deploy, put the live URL in:

- Google Drive folder
- `LIVE_URL.txt`
- the assignment portal submission fields

## Project structure

```text
src/app                 # Next.js pages + API routes
src/components          # Login, dashboard, TipTap editor, sharing UI
src/lib                 # auth, permissions, import helpers, prisma
prisma/                 # schema + seed
samples/                # sample markdown for import demo
ARCHITECTURE.md         # prioritization + design decisions
AI_WORKFLOW.md          # AI usage note
SUBMISSION.md           # exact deliverables checklist
DEPLOYMENT.md           # free hosting guide
VIDEO_SCRIPT.md         # 3–5 min walkthrough script
```

## Incomplete / out of scope

Working intentionally cut:

- Real-time multiplayer cursors / CRDT sync
- Comments / suggestion mode
- Google-account OAuth
- Enterprise ACL / audit logs

If given another 2–4 hours: Neon production wiring polish, presence indicators, richer DOCX fidelity, share-link tokens.
