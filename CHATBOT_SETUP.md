# TEDxJSS Website - Chatbot Setup Guide

## Overview
The chatbot is now integrated with OpenAI's API and ready for Vercel deployment. It uses a serverless function to handle chat requests while maintaining conversation history.

## Quick Start

✅ **Development Server**: Your server is running at `http://localhost:3000`

1. **API Key Configured**: Your `.env.local` has the OpenAI API key
2. **Open in Browser**: Visit `http://localhost:3000` to test the chatbot
3. **Click the Chat Bubble**: Look for the red 💬 bubble in the bottom-right corner

## Setup Instructions

### 1. Get Your OpenAI API Key
1. Go to [OpenAI API Keys](https://platform.openai.com/api-keys)
2. Create a new API key (or use an existing one)
3. Copy the key safely

### 2. Local Development Setup

#### Install Dependencies
```bash
npm install
```

#### Set Up Environment Variables
Create a `.env.local` file in the project root:
```
OPENAI_API_KEY=your_openai_api_key_here
```

#### Run Development Server
```bash
npm run dev
```
This will start a local development server at `http://localhost:3000`. The chatbot should now work with real API responses.

### 3. Deploy to Vercel

#### Using Vercel CLI
```bash
npm i -g vercel
vercel
```

#### Using Vercel Dashboard
1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com)
3. Click "New Project" and import your repository
4. In the environment variables section, add:
   - Key: `OPENAI_API_KEY`
   - Value: Your OpenAI API key
5. Deploy

## Customizing the Chatbot

### Editing the System Prompt

The chatbot's personality and behavior is controlled by the system prompt. You can edit it in two places:

**For Local Development** - Edit `server.js`:
```javascript
const SYSTEM_PROMPT = `You are a helpful assistant for TEDxJSS International School...`;
```

**For Vercel Production** - Edit `api/chat.js`:
```javascript
const SYSTEM_PROMPT = `You are a helpful assistant for TEDxJSS International School...`;
```

Example custom prompt:
```javascript
const SYSTEM_PROMPT = `You are a friendly and helpful TEDx ambassador representing TEDxJSS International School. 
Your role is to:
- Answer questions about our upcoming events and past talks
- Help with speaker inquiries
- Provide information about the TEDx mission
- Direct visitors to the contact page for complex requests

Keep responses friendly, concise (under 150 words), and always end with "How else can I help?"`;
```

### Adjusting API Parameters

In both `server.js` and `api/chat.js`, you can adjust:
- `model`: Change from 'gpt-3.5-turbo' to 'gpt-4' for better responses (costs more)
- `temperature`: Controls randomness (0-1, default 0.7)
  - Lower (0.3) = more focused/consistent
  - Higher (0.9) = more creative/varied
- `max_tokens`: Maximum response length (default 150)

```javascript
const response = await openai.createChatCompletion({
  model: 'gpt-3.5-turbo',      // Change model here
  messages: formattedMessages,
  temperature: 0.7,             // Change creativity here
  max_tokens: 150,              // Change length limit here
});
```

## Features

✅ Persistent conversation history  
✅ Real-time OpenAI integration  
✅ Error handling  
✅ Mobile responsive  
✅ Matches site color scheme (TEDx red)  
✅ Easy system prompt customization  
✅ Works locally and on Vercel  

## File Structure

```
api/
  └── chat.js          # Vercel serverless function (production)
server.js              # Local development server
index.html             # Updated with API integration
package.json           # Dependencies
.env.local             # Local environment variables (add to .gitignore!)
.env.example           # Template for environment variables
.gitignore             # Prevents API key from being committed
vercel.json            # Vercel configuration
CHATBOT_SETUP.md       # This file
```

## Troubleshooting

### "OPENAI_API_KEY not set"
- Check `.env.local` has the API key
- Make sure `.env.local` is in the project root
- For Vercel: add it to the environment variables in Vercel dashboard

### Chatbot not responding
- Check browser console (F12 → Console tab) for error messages
- Verify your OpenAI API key is valid
- Check the API has available credits at [OpenAI Billing](https://platform.openai.com/account/billing/overview)
- Watch the terminal where `npm run dev` is running for error logs

### High API costs
- Reduce `max_tokens` in the code
- Use 'gpt-3.5-turbo' instead of 'gpt-4'
- Monitor usage at [OpenAI Usage Page](https://platform.openai.com/account/usage/overview)

### Development server not starting
```bash
# Check if port 3000 is in use
lsof -i :3000

# Kill any process on port 3000 if needed
kill -9 <PID>

# Try again
npm run dev
```

## Security Notes

🔒 **Never commit your API key to version control**
- Always use environment variables
- Add `.env.local` to `.gitignore` (already done)
- Never share your OpenAI API key
- Rotate keys if they're accidentally exposed

## Testing the Chatbot

1. Open `http://localhost:3000` in your browser
2. Click the red chat bubble in the bottom-right
3. Type a message like "Tell me about TEDx"
4. Wait for the response from OpenAI
5. Continue the conversation

## Next Steps

1. ✅ Test the chatbot locally at `http://localhost:3000`
2. ✅ Customize the system prompt in `server.js`
3. Deploy to Vercel:
   - Push code to GitHub
   - Connect to Vercel
   - Add OPENAI_API_KEY environment variable
   - Deploy!
4. Update the system prompt in `api/chat.js` to match `server.js` for production
5. Monitor API usage and costs on OpenAI dashboard
