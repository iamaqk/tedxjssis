// Configuration for chatbot API endpoint
// Update this URL when deploying to GitHub Pages
const CHATBOT_CONFIG = {
  // For local development
  apiEndpoint: typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? '/api/chat'
    : 'https://your-vercel-app.vercel.app/api/chat'
};

// To use on GitHub Pages:
// 1. Deploy the Vercel backend from api/chat.js
// 2. Replace 'https://your-vercel-app.vercel.app' with your actual Vercel URL
// 3. Example: 'https://tedxjssis-bot.vercel.app/api/chat'
