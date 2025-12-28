# TEDx Chatbot - Node.js Server Setup

This is a **full Node.js application** with an integrated chatbot powered by OpenAI. Everything runs on a single `server.js` file.

## Quick Start

### Installation
```bash
npm install
```

### Run Locally
```bash
npm run dev
# or
npm start
```

Visit `http://localhost:3000` and test the chatbot!

---

## Deployment Options

Choose one based on your needs:

### Option 1: Self-Hosted (VPS/Dedicated Server)
**Best for: Full control, custom domain, always-on server**

1. Get a VPS (DigitalOcean, Linode, AWS EC2, etc.)
2. Install Node.js on the server
3. Clone your repository
4. Run:
   ```bash
   npm install
   npm start
   ```
5. Use PM2 or systemd to keep it running permanently

### Option 2: Heroku (Deprecated but Alternative)
**Best for: Simple deployment, free tier limited**

1. Create Heroku account
2. Connect your GitHub repo
3. Set environment variable: `OPENAI_API_KEY`
4. Deploy

### Option 3: Railway.app
**Best for: Easy deployment, pay-as-you-go**

1. Go to [railway.app](https://railway.app)
2. Connect GitHub repo
3. Add `OPENAI_API_KEY` secret
4. Deploy (auto-generates public URL)

### Option 4: Render.com
**Best for: Free tier with limits, simple setup**

1. Go to [render.com](https://render.com)
2. Create new Web Service
3. Connect GitHub
4. Set environment: `OPENAI_API_KEY`
5. Deploy

### Option 5: Local Network/Home Server
**Best for: Testing, LAN only**

Just run `npm start` and access from your local network at `http://your-ip:3000`

---

## Project Structure

```
📦 Project
├── 📄 server.js              ← Main application (handles API + static files)
├── 📄 index.html             ← Website (served by server.js)
├── 📄 config.js              ← API configuration
├── 📄 package.json           ← Dependencies
├── 📄 .env.local             ← API key (local only)
├── 📄 .env.example           ← Template
└── 📁 assets/                ← Images, PDFs, etc.
```

## Environment Setup

### Local Development
Create `.env.local`:
```
OPENAI_API_KEY=sk-proj-xxxxx...
```

### Production (Server)
Set environment variable on your server:
```bash
export OPENAI_API_KEY=sk-proj-xxxxx...
```

Or use a `.env` file (not in git):
```
OPENAI_API_KEY=sk-proj-xxxxx...
```

---

## Customization

### Change Chatbot Behavior
Edit the `SYSTEM_PROMPT` in `server.js`:

```javascript
const SYSTEM_PROMPT = `You are a helpful assistant for TEDxJSS International School...`;
```

### Adjust API Parameters
In `server.js`, modify:
- `model`: 'gpt-3.5-turbo' or 'gpt-4'
- `temperature`: 0.7 (creativity level)
- `max_tokens`: 150 (response length)

### Add Static Files
Put files in the project root or in `assets/` - they'll be served automatically.

---

## Monitoring

### Local Development
- Check terminal output for errors
- Browser console (F12) shows client errors
- Server logs show API calls

### Production
Use services like:
- **PM2 Plus** - Monitor Node.js processes
- **Sentry** - Error tracking
- **DataDog** - Performance monitoring
- **New Relic** - APM (Application Performance Monitoring)

---

## Performance & Costs

### Resource Usage
- **CPU**: Minimal (< 5% idle)
- **Memory**: ~80MB base
- **Disk**: ~100MB + node_modules
- **Bandwidth**: Depends on traffic

### OpenAI Costs
- GPT-3.5-turbo: ~$0.002 per message
- GPT-4: ~$0.015 per message
- Monitor at: [platform.openai.com/usage](https://platform.openai.com/account/usage/overview)

---

## Common Deployments

### DigitalOcean App Platform
```bash
# Create app.yaml in root:
```
name: tedx-chatbot
services:
- name: web
  github:
    branch: main
    repo: username/tedxjssis
  build_command: npm install
  run_command: npm start
  envs:
  - key: OPENAI_API_KEY
    scope: RUN_AND_BUILD_TIME
    value: ${OPENAI_API_KEY}
envs:
- key: OPENAI_API_KEY
  value: sk-proj-xxxxx
```

### PM2 (Self-hosted VPS)
```bash
# Install PM2
npm install -g pm2

# Start app
pm2 start server.js --name "tedx-chatbot"

# Make it restart on boot
pm2 startup
pm2 save

# Monitor
pm2 monit
```

### Docker (Any cloud provider)
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

ENV PORT=3000
EXPOSE 3000

CMD ["npm", "start"]
```

Deploy this Docker image to any cloud service that supports containers.

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Port already in use | Change PORT in server.js or kill process: `lsof -i :3000` |
| API key not found | Check `.env.local` or environment variables |
| Chat not responding | Check OpenAI API status and billing |
| High CPU usage | Check for infinite loops, reduce max_tokens |
| 404 on assets | Make sure files are in project root or `assets/` |

---

## Security Notes

🔒 **Critical**
- Never commit `.env.local` to git
- Use environment variables for production
- Keep API key secret
- Use HTTPS in production (your hosting provider handles this)
- Set spending limits on OpenAI account

---

## Next Steps

1. ✅ Run locally: `npm run dev`
2. ✅ Test chatbot at `http://localhost:3000`
3. Choose deployment option above
4. Deploy and share with your TEDx team!

---

**Questions?**
- [Node.js Docs](https://nodejs.org/docs/)
- [OpenAI API Docs](https://platform.openai.com/docs/)
- [Express.js Guide](https://expressjs.com/)
