# GitHub Pages Deployment - What's New

Your website is now configured for GitHub Pages deployment! Here's what was added:

## New Files Created

1. **`.github/workflows/deploy.yml`** - Auto-deploys to GitHub Pages on every push
2. **`config.js`** - Centralized API endpoint configuration
3. **`DEPLOY_GITHUB_PAGES.md`** - Complete deployment guide
4. **`DEPLOYMENT_CHECKLIST.md`** - Quick checklist for deployment

## Updated Files

1. **`index.html`** - Now loads `config.js` and uses dynamic API endpoint
2. **`package.json`** - Updated build script for GitHub Pages

## How It Works

```
You Push to GitHub
        ↓
GitHub Actions Workflow Runs
        ↓
Files Deployed to GitHub Pages
        ↓
Frontend Loads (HTML/CSS/JS)
        ↓
User Clicks Chat
        ↓
Request Sent to Vercel API
        ↓
Vercel Calls OpenAI
        ↓
Response Shown in Chat
```

## What You Need to Do

### 1. Deploy Backend to Vercel (5 min)
- Go to [vercel.com](https://vercel.com)
- Import your GitHub repo
- Add `OPENAI_API_KEY` environment variable
- Deploy
- **Copy the Vercel URL**

### 2. Update Frontend Configuration (2 min)
- Open `config.js`
- Replace `https://your-vercel-app.vercel.app` with your Vercel URL
- Commit and push

### 3. Enable GitHub Pages (2 min)
- Go to Settings → Pages
- Select `main` branch, `/ (root)` folder
- Save

### 4. Push to Deploy (1 min)
- GitHub Actions will automatically deploy
- Visit your GitHub Pages URL to test

## File Locations

```
📦 Project Root
├── 📄 config.js                           ← Edit with Vercel URL!
├── 📄 index.html                          ← Frontend (GitHub Pages)
├── 📄 DEPLOY_GITHUB_PAGES.md             ← Full guide
├── 📄 DEPLOYMENT_CHECKLIST.md            ← Quick checklist
├── 📁 .github
│   └── 📁 workflows
│       └── 📄 deploy.yml                  ← Auto-deploy config
├── 📁 api
│   └── 📄 chat.js                        ← Backend (Vercel)
└── 📄 server.js                           ← Local dev (not deployed)
```

## Architecture

```
GitHub Pages         Vercel                 OpenAI
(Frontend)          (API)                  (AI)
─────────           ──────                 ──────
index.html  ──→  api/chat.js  ──→  GPT-3.5-turbo
config.js
```

## Environment Variables

- **GitHub Pages**: None needed (static files only)
- **Vercel**: `OPENAI_API_KEY` (set in Vercel dashboard)
- **Local Dev**: `.env.local` (already has it)

## Important Notes

- `config.js` automatically detects localhost vs production
- API calls on GitHub Pages go to Vercel backend
- API calls on localhost go to local Node server
- Everything is mobile-responsive

## Next Steps

1. 📖 Read [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)
2. ⚙️ Deploy to Vercel and copy URL
3. 🔧 Update `config.js` with Vercel URL
4. ✅ Enable GitHub Pages
5. 🚀 Push to GitHub (auto-deploys)

## Support Files

- **[DEPLOY_GITHUB_PAGES.md](DEPLOY_GITHUB_PAGES.md)** - Detailed step-by-step guide
- **[CHATBOT_SETUP.md](CHATBOT_SETUP.md)** - Chatbot customization
- **[GITHUB_PAGES_SETUP.md](GITHUB_PAGES_SETUP.md)** - Architecture details

---

**You're ready to deploy!** 🚀
