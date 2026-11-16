# AI Workflow Note

## Tools used

- Cursor agent / coding assistant for scaffolding, boilerplate, and iterative implementation
- Manual verification in browser + Vitest for correctness

## Where AI materially sped things up

1. **Boilerplate acceleration** — Next.js route handlers, Prisma schema drafts, and TipTap wiring
2. **Import helpers** — first-pass markdown/plain-text HTML conversion
3. **Docs packaging** — README / architecture / submission checklist structure

## What I changed or rejected from AI output

- Rejected overbuilt auth (full OAuth/NextAuth) in favor of seeded cookie sessions that prove sharing quickly
- Rejected shallow “feature checklist UI” without real permission enforcement
- Tightened sharing to explicit owner/editor/viewer rules with server-side checks
- Kept version history explicit (“Save version”) instead of snapshotting every keystroke
- Simplified styling away from generic purple SaaS defaults toward a calmer product look
- Moved Node-only import helpers out of client bundles after catching a boundary issue

## How I verified correctness / UX / reliability

1. `npm run setup` — schema sync + seed accounts
2. `npm test` — import conversion + permission unit tests
3. Manual flow:
   - Alice create/edit/share
   - Bob edit shared doc
   - Cara read-only
   - Import sample markdown
   - Export Markdown
   - Restore a version
4. `npm run build` — production compile check before submission

## Judgment call

AI was used as a force multiplier for implementation speed, not as a substitute for product prioritization. Scope cuts and access-model decisions were intentional and human-owned.
