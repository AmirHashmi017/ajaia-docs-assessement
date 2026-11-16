# Walkthrough Video Script (3–5 minutes)

Record with **Loom** (free) or YouTube unlisted. Keep it calm and demo-first.

## Setup before recording

1. App running locally or on live URL
2. Browser zoom ~110%
3. Have `samples/product-brief.md` ready to import
4. Be logged out at start

## Script

### 0:00–0:20 — Intro
> “I’m Fahd Hassan. This is Ajaia Docs — a focused collaborative editor slice for the AI-native full stack assignment. I’ll show what works end to end, what I deprioritized, and how AI helped without replacing judgment.”

### 0:20–1:20 — Core editing flow (Alice)
1. Sign in as Alice
2. Open Welcome document
3. Rename title
4. Apply bold / italic / underline / heading / list
5. Pause to show autosave status
> “Persistence is SQLite via Prisma locally. Formatting is TipTap HTML, so reopen preserves structure.”

### 1:20–2:20 — Sharing model
1. Show Owned vs Shared on dashboard
2. In Welcome doc, point out Bob = editor, Cara = viewer
3. Sign out → Bob → open shared doc → edit successfully
4. Sign out → Cara → show read-only toolbar/state
> “Sharing is intentionally simple: owner, editor, viewer — enforced on the server, not just the UI.”

### 2:20–3:10 — File upload + stretch features
1. As Alice, import `samples/product-brief.md`
2. Show imported editable content + source file note
3. Click **Save version**, make a change, restore previous version
4. Click **Export MD** and briefly show download
> “Stretch goals I shipped: role-based sharing beyond basic access, version history, and Markdown export.”

### 3:10–3:50 — Prioritization + AI workflow
> “I deprioritized realtime CRDT collaboration, comments, and OAuth so the core product loop stayed deep. I used Cursor to accelerate scaffolding and helpers, then rejected overbuilt auth and unverified permission shortcuts. I verified with seeded multi-user flows, Vitest, and a production build.”

### 3:50–4:20 — Close
> “Reviewer accounts are in the README. Live URL and source are in the Google Drive folder. Thanks for reviewing.”

## Recording tips

- Loom free account is enough; set video to **public** or unlisted-accessible link
- Do one clean take; don’t narrate every keystroke
- If something glitches, keep going and narrate the intended behavior briefly
- After upload, paste the link into `VIDEO_URL.txt` and the assignment portal
