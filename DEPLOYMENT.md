# Free Deployment Guide (no paid services)

## Recommended path: Vercel + MongoDB Atlas (both free)

This project already uses **MongoDB Atlas**. Keep the same `DATABASE_URL` for local and production.

### 1) MongoDB Atlas

1. Database name used by this app: `ajaia_docs` (auto-created on first write)
2. In Atlas → Network Access, allow your IP and `0.0.0.0/0` for Vercel deploys
3. Connection string format:

```text
mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/ajaia_docs?retryWrites=true&w=majority&appName=Cluster0
```

### 2) Deploy on Vercel (free)

1. Push this project to GitHub (private is fine)
2. Go to [https://vercel.com](https://vercel.com) → New Project → import the repo
3. Set env vars:
   - `DATABASE_URL` = your Atlas connection string
   - `AUTH_SECRET` = long random string
   - `NEXT_PUBLIC_APP_NAME` = `Ajaia Docs`
4. Build command stays `npm run build`
5. After first deploy, seed once from your machine:

```bash
DATABASE_URL="mongodb+srv://..." npm run db:push
DATABASE_URL="mongodb+srv://..." npm run db:seed
```

6. Copy the Vercel URL into `LIVE_URL.txt`

### Local setup (also Atlas)

```bash
cp .env.example .env   # put your Atlas URL in DATABASE_URL
npm install
npm run setup
npm run dev
```

### Important

Do **not** require reviewers to pay for anything.  
Keep demo accounts in the README and `LIVE_URL.txt`.

## After deploy checklist

- [ ] Open live URL
- [ ] Login as Alice / Bob / Cara
- [ ] Confirm Welcome doc sharing still works
- [ ] Paste URL into `LIVE_URL.txt`
- [ ] Paste same URL into Google Drive + assignment portal
