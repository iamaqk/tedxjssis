# GitHub Pages & Vercel Backend Deployment Guide

This setup uses **GitHub Pages** for the frontend and **Vercel** for the serverless API backend.

## Architecture

```
User Browser
    ↓
GitHub Pages (Static HTML/CSS/JS)
    ↓
Vercel Serverless Function (/api/chat)
    ↓
OpenAI API
```

## Step 1: Deploy Backend to Vercel

### If you haven't deployed to Vercel yet:

1. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub

2. **Deploy the Backend**
   ```bash
   npm i -g vercel
   vercel
   ```
   - Select your project
   - Add environment variable: `OPENAI_API_KEY=your_api_key`

3. **Get Your Vercel URL**
   - After deployment, you'll get a URL like: `https://your-project.vercel.app`
   - Note this URL - you'll need it for the next step

## Step 2: Configure Frontend for GitHub Pages

### Update the chatbot API endpoint in index.html:

In `index.html`, find the line in the sendMessage function:
```javascript
const response = await fetch('/api/chat', {
```

Replace `/api/chat` with your Vercel URL:
```javascript
const response = await fetch('https://your-project.vercel.app/api/chat', {
```

**Example:**
```javascript
const response = await fetch('https://tedxjssis-bot.vercel.app/api/chat', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        messages: chatHistory
    })
});
```

## Step 3: Enable GitHub Pages

### In your GitHub repository:

1. Go to **Settings** → **Pages**
2. Under "Build and deployment":
   - Source: **Deploy from a branch**
   - Branch: **main** (or **master**)
   - Folder: **/ (root)**
3. Click **Save**

GitHub Actions will automatically deploy your site!

## Step 4: Monitor Deployment

1. Go to your repository
2. Click the **Actions** tab
3. Watch for the "Deploy to GitHub Pages" workflow
4. Once complete, your site is live at: `https://your-username.github.io/tedxjssis/`

## File Structure for GitHub Pages

```
.github/
  └── workflows/
      └── deploy.yml         # Auto-deployment configuration
index.html                   # Main site (update API endpoint here!)
api/
  └── chat.js               # Vercel serverless function (for Vercel only)
server.js                   # Local dev server (not used on GitHub Pages)
.env.local                  # Local development only
vercel.json                 # Vercel configuration
```

## Quick Checklist

- [ ] Deploy Vercel backend
- [ ] Note your Vercel URL
- [ ] Update API endpoint in index.html with your Vercel URL
- [ ] Enable GitHub Pages in repository settings
- [ ] Push to GitHub (main/master branch)
- [ ] Check Actions tab for successful deployment
- [ ] Visit your GitHub Pages URL to test

## Verify It Works

1. Go to your GitHub Pages URL
2. Open browser console (F12 → Console)
3. Click the chat bubble
4. Send a message
5. Check console for any errors
6. If you see the response - it's working! 🎉

## Troubleshooting

### "CORS error" or "API error"
- Make sure you updated the API endpoint in index.html
- Verify the Vercel URL is correct
- Check that Vercel has the `OPENAI_API_KEY` environment variable set

### "404 - Page not found"
- Check that GitHub Pages is enabled in Settings → Pages
- Make sure you're on the correct branch (main/master)
- Check the Actions tab for deployment errors

### Changes not showing up
- GitHub Pages takes 1-2 minutes to deploy
- Check the Actions tab to see if deployment succeeded
- Try hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

### "Blank page" or "can't find files"
- You might need to add a `basePath` to your URL
- If your repo is `tedxjssis`, your GitHub Pages URL will be:
  `https://username.github.io/tedxjssis/`
- Update all asset paths in index.html to include `/tedxjssis/` prefix

## Costs

- **GitHub Pages**: Free ✅
- **Vercel Backend**: Free tier includes 100 requests/day (plenty for testing)
- **OpenAI API**: Pay-as-you-go (watch your usage!)

## Next Steps

1. Deploy Vercel backend (if not done)
2. Update API endpoint in index.html
3. Enable GitHub Pages
4. Push to GitHub
5. Test at your GitHub Pages URL
6. Share with others!

## Custom Domain (Optional)

If you want a custom domain instead of `github.io`:

1. Get a domain (Namecheap, Godaddy, etc.)
2. Go to GitHub repository → Settings → Pages
3. Under "Custom domain", enter your domain
4. Follow GitHub's DNS setup instructions
5. Add DNS records pointing to GitHub Pages

---

For more help:
- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [Vercel Docs](https://vercel.com/docs)
- [CORS Issues](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
