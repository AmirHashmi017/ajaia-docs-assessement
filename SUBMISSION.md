# SUBMISSION.md

Candidate: **Fahd Hassan** (`fahdhassan.dev@gmail.com`)  
Project: **Ajaia Docs** — collaborative document editor slice

## Exactly what is included in this folder / Drive package

| Item | Path / location |
| --- | --- |
| Source code | entire `ajaia-collab-docs/` project |
| Local setup instructions | `README.md` |
| Architecture note | `ARCHITECTURE.md` |
| AI workflow note | `AI_WORKFLOW.md` |
| This inventory | `SUBMISSION.md` |
| Free deployment guide | `DEPLOYMENT.md` |
| Walkthrough video script | `VIDEO_SCRIPT.md` |
| Live product URL | `LIVE_URL.txt` *(fill after deploy)* |
| Walkthrough video URL | `VIDEO_URL.txt` *(fill after recording)* |
| Sample import file | `samples/product-brief.md` |
| Screenshots | `screenshots/` *(add 2–4 PNGs before upload)* |
| Seeded credentials | listed below + README |

## Live product URL

See `LIVE_URL.txt` after deployment.  
Recommended free stack: **Vercel + Neon** (instructions in `DEPLOYMENT.md`).

## Reviewer credentials

Password for all: `password123`

- `alice@ajaia.dev` — owner
- `bob@ajaia.dev` — editor on Welcome doc
- `cara@ajaia.dev` — viewer on Welcome doc

## What is working

- Document create / rename / edit / autosave / reopen
- Rich text formatting (bold, italic, underline, headings, lists)
- File import (`.txt`, `.md`, `.docx`)
- Sharing with owner / editor / viewer distinction
- Owned vs shared lists
- MongoDB Atlas persistence
- Version history + restore
- Markdown export
- Automated tests
- Deployable Next.js app

## What is incomplete / intentionally skipped

- Real-time collaboration cursors
- Comments / suggestion mode
- OAuth / SSO
- Enterprise ACL

## What I would build next (2–4 hours)

1. Production Postgres (Neon) hardening + migration docs polish
2. Lightweight presence indicators
3. Share-link tokens for anonymous viewers
4. Stronger DOCX import edge cases

## Assignment portal paste fields

1. **Video Submission Link** → contents of `VIDEO_URL.txt`
2. **Submission (Markdown)** → paste a short version of this file (or the Drive folder summary)
3. Upload / share **one Google Drive folder** containing all materials above
