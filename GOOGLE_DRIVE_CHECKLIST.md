# What to upload to Google Drive (exact checklist)

Create **one folder** named:

`Fahd_Hassan_Ajaia_AI_Native_Assignment`

## Put these items inside

1. **Source code**
   - Zip the project as `ajaia-collab-docs-source.zip`
   - Exclude `node_modules/`, `.next/`, `prisma/dev.db` (optional to exclude; fine either way)
   - Or upload the full folder, but zipping is cleaner

2. **README.md**
3. **ARCHITECTURE.md**
4. **AI_WORKFLOW.md**
5. **SUBMISSION.md**
6. **DEPLOYMENT.md**
7. **VIDEO_SCRIPT.md** (optional but helpful)
8. **LIVE_URL.txt** (with your deployed URL filled in)
9. **VIDEO_URL.txt** (with Loom/YouTube link filled in)
10. **screenshots/** (2–4 images: login, dashboard owned/shared, editor+share panel, import)
11. **samples/product-brief.md** (nice-to-have for reviewers)

## Share settings

- Share the folder link so reviewers can open it (**Anyone with the link: Viewer** is usually fine)
- Paste that Drive folder link into the assignment portal submission markdown

## Assignment portal fields

### Video Submission Link
Paste the Loom/YouTube URL from `VIDEO_URL.txt`

### Submission (Markdown)
Paste something like:

```markdown
# Ajaia Docs — Fahd Hassan

## Google Drive
<PASTE_DRIVE_FOLDER_LINK>

## Live URL
<PASTE_LIVE_URL>

## Demo accounts
- alice@ajaia.dev / password123 (owner)
- bob@ajaia.dev / password123 (editor)
- cara@ajaia.dev / password123 (viewer)

## Included
- Source code
- README.md (local setup)
- ARCHITECTURE.md
- AI_WORKFLOW.md
- SUBMISSION.md
- LIVE_URL.txt + VIDEO_URL.txt
- Screenshots

## Working
Document CRUD, TipTap rich text, file import (.txt/.md/.docx), role-based sharing, persistence, version history, Markdown export, tests.

## Intentionally skipped
Realtime CRDT collaboration, comments/suggestions, OAuth.
```
