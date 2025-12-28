# Deploy to GitHub Pages + Vercel - Complete Guide

Your TEDx website is now ready to deploy to **GitHub Pages** (frontend) with **Vercel** backend (API).

## Quick Summary

| Component | Platform | Cost |
|-----------|----------|------|
| **Frontend** (HTML, CSS, JS) | GitHub Pages | FREE ✅ |
| **API Backend** (ChatBot) | Vercel | FREE (100 req/day) |
| **AI Model** (GPT responses) | OpenAI | Pay-as-you-go |

---

## Step 1: Deploy Backend to Vercel (5 minutes)

### Option A: Via Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) → Sign up with GitHub
2. Click "Add New..." → "Project"
3. Select your repository (`tedxjssis`)
4. **Important**: Under "Environment Variables", add:
   ```
   OPENAI_API_KEY = sk-proj-xxxxx...
   ```
5. Click "Deploy"
6. **Copy your Vercel URL** (looks like: `https://tedxjssis-abc123.vercel.app`)

### Option B: Via CLI

```bash
npm i -g vercel
vercel
# Follow prompts, add OPENAI_API_KEY when asked
```

---

## Step 2: Update Frontend Configuration (2 minutes)

### Edit `config.js`

Open [config.js](config.js) and replace the Vercel URL:

```javascript
const CHATBOT_CONFIG = {
  apiEndpoint: typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? '/api/chat'
    : 'https://YOUR-VERCEL-URL.vercel.app/api/chat'  // ← UPDATE THIS LINE
};
```

**Example:**
```javascript
const CHATBOT_CONFIG = {
  apiEndpoint: typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? '/api/chat'
    : 'https://tedxjssis-bot.vercel.app/api/chat'
};
```

---

## Step 3: Enable GitHub Pages (3 minutes)

1. Go to your GitHub repository
2. Click **Settings** → **Pages**
3. Under "Build and deployment":
   - **Source**: "Deploy from a branch"
   - **Branch**: `main` (or `master`)
   - **Folder**: `/ (root)`
4. Click **Save**

### Auto-Deploy with GitHub Actions ✅

Your [.github/workflows/deploy.yml](.github/workflows/deploy.yml) will automatically:
- Deploy when you push to `main`
- Update your site within 1-2 minutes

---

## Step 4: Push to GitHub (1 minute)

```bash
git add .
git commit -m "Add GitHub Pages deployment"
git push origin main
```

---

## Step 5: Find Your Site URL

### Your site will be available at:

- **User/Org Pages**: `https://username.github.io/tedxjssis/`
- **Project Pages**: `https://username.github.io/repository-name/`

Check your repo Settings → Pages to see the exact URL.

---

## ✅ Verify Everything Works

1. **Visit your GitHub Pages URL**
2. Click the red chat bubble (bottom-right)
3. Type a message like "Hello"
4. Wait for AI response
5. If it works → **You're done!** 🎉

### Troubleshooting

| Problem | Solution |
|---------|----------|
| Blank page | Check Actions tab for deploy errors |
| Chat not responding | Verify config.js has correct Vercel URL |
| CORS error | Make sure Vercel is deployed with API key |
| 404 errors | Might need `/tedxjssis/` prefix in URLs |

---

## File Structure

```
.github/workflows/
  └── deploy.yml          # ← Auto-deploys to GitHub Pages
config.js                 # ← Update with Vercel URL
index.html                # ← Frontend (deployed to GitHub Pages)
api/
  └── chat.js            # ← Backend (deployed to Vercel only)
server.js                 # ← Local dev server (not deployed)
.env.local                # ← Local only (secret, don't commit)
```

---

## Local Development Still Works

For local testing with `npm run dev`:
- config.js detects `localhost`
- Automatically uses `/api/chat` endpoint
- Your local Node server responds

---

## Monitoring & Costs

### GitHub Pages
- Free, unlimited bandwidth
- Auto-deploys from main branch

### Vercel Backend  
- **Free tier**: 100 requests/day
- **Pro**: $20/month (1000 requests/day)
- Monitor at [vercel.com/dashboard](https://vercel.com/dashboard)

### OpenAI API
- **Cost**: ~$0.002 per message (gpt-3.5-turbo)
- Monitor at [platform.openai.com/usage](https://platform.openai.com/account/usage/overview)
- Set spending limits to avoid surprises

---

## Making Changes

### To update the website:
```bash
# Make changes to index.html or other files
git add .
git commit -m "Update website"
git push origin main
# GitHub Actions will auto-deploy (1-2 min)
```

### To change the chatbot behavior:
Edit the system prompt in both files:
- **Local**: `server.js` (for `npm run dev`)
- **Production**: `api/chat.js` (for Vercel)

---

## Common Tasks

### Change Chat Behavior
Edit the `SYSTEM_PROMPT` in `api/chat.js`:
```javascript
const SYSTEM_PROMPT = `Your custom prompt here...`;
```

### Disable Chatbot Temporarily
In `config.js`, change the endpoint to an invalid URL:
```javascript
apiEndpoint: 'https://disabled.example.com/api/chat'
```

### Add Custom Domain
1. Buy domain (Namecheap, Godaddy, etc.)
2. Settings → Pages → Custom domain
3. Add DNS records
4. GitHub Pages validates automatically

---

## Next Steps

- [ ] Deploy to Vercel (copy the URL!)
- [ ] Update config.js with Vercel URL
- [ ] Enable GitHub Pages
- [ ] Push to GitHub
- [ ] Visit your site and test
- [ ] Share with your TEDx team!

---

**You're all set!** Your chatbot is now live on GitHub Pages! 🚀

For questions:
- GitHub Pages: [docs.github.com/pages](https://docs.github.com/en/pages)
- Vercel: [vercel.com/docs](https://vercel.com/docs)
- OpenAI: [platform.openai.com/docs](https://platform.openai.com/docs)
