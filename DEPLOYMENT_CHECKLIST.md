# 🚀 Deployment Checklist

Use this checklist to deploy your TEDx website to GitHub Pages with Vercel backend.

## Pre-Deployment

- [ ] You have a GitHub account
- [ ] You have an OpenAI API key (from [platform.openai.com](https://platform.openai.com/api-keys))
- [ ] Your code is pushed to GitHub (`main` or `master` branch)
- [ ] You have the Vercel CLI or can use the web dashboard

---

## Phase 1: Backend (Vercel) - 5 minutes

- [ ] Go to [vercel.com](https://vercel.com)
- [ ] Sign in/Sign up with GitHub
- [ ] Import your repository
- [ ] Add environment variable `OPENAI_API_KEY` with your API key
- [ ] Deploy
- [ ] **Copy your Vercel URL** (e.g., `https://tedxjssis-bot.vercel.app`)

---

## Phase 2: Frontend (GitHub Pages) - 10 minutes

### Update Configuration

- [ ] Open `config.js`
- [ ] Replace `https://your-vercel-app.vercel.app` with your actual Vercel URL
- [ ] Save the file

### Verify Files

- [ ] Confirm `.github/workflows/deploy.yml` exists
- [ ] Confirm `config.js` has the Vercel URL

### Enable GitHub Pages

- [ ] Go to your repository on GitHub
- [ ] Go to **Settings** → **Pages**
- [ ] Set:
  - Source: "Deploy from a branch"
  - Branch: `main` (or `master`)
  - Folder: `/ (root)`
- [ ] Click **Save**

### Deploy

- [ ] Push your changes: `git add . && git commit -m "Setup GitHub Pages" && git push`
- [ ] Go to **Actions** tab and watch the deploy workflow
- [ ] Wait for green ✅ checkmark (1-2 minutes)

---

## Phase 3: Verification - 5 minutes

### Test the Site

- [ ] Go to your GitHub Pages URL (shown in Settings → Pages)
- [ ] Wait for the page to load
- [ ] Click the red chat bubble in bottom-right
- [ ] Type a test message
- [ ] Verify you get a response from the AI
- [ ] Open browser console (F12) and check for errors

---

## Phase 4: Share & Monitor

### Share Your Site

- [ ] Copy your GitHub Pages URL
- [ ] Share with your TEDx team
- [ ] Test on mobile devices (should be responsive)

### Monitor

- [ ] Check [Vercel Dashboard](https://vercel.com/dashboard) for API errors
- [ ] Check [OpenAI Dashboard](https://platform.openai.com/account/usage/overview) for usage/costs
- [ ] Watch GitHub Actions for deployment status

---

## Troubleshooting

### Site Not Showing Up
1. Check Settings → Pages - is it configured?
2. Check Actions tab - did deploy succeed?
3. Hard refresh your browser (Ctrl+Shift+R)

### Chat Not Working
1. Open browser console (F12 → Console tab)
2. Look for error messages
3. Check that config.js has correct Vercel URL
4. Verify Vercel has OPENAI_API_KEY set

### Getting "CORS Error"
- Make sure Vercel is deployed with API key
- Check that fetch URL in config.js is correct

---

## Success Criteria ✅

- [ ] Your site loads at GitHub Pages URL
- [ ] Chat bubble is visible
- [ ] You can send messages
- [ ] AI responds within 5 seconds
- [ ] No errors in browser console

---

## Performance Tips

- [ ] GitHub Pages caches files - use `?v=1` for CSS/JS updates
- [ ] Vercel has a free tier - monitor costs
- [ ] OpenAI billing is separate - set spending limits

---

## After Deployment

- [ ] Update system prompt in `api/chat.js` if needed
- [ ] Monitor API costs weekly
- [ ] Set up error notifications (optional)
- [ ] Consider custom domain (optional)

---

**All set! Your chatbot is live! 🎉**

Questions? Check the detailed guides:
- [DEPLOY_GITHUB_PAGES.md](DEPLOY_GITHUB_PAGES.md)
- [GITHUB_PAGES_SETUP.md](GITHUB_PAGES_SETUP.md)
- [CHATBOT_SETUP.md](CHATBOT_SETUP.md)
