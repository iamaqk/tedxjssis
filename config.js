// Configuration for chatbot API endpoint
// For production on GitHub Pages, update this with your deployed server URL
// Example: https://your-app.onrender.com/api/chat
const CHATBOT_CONFIG = {
  apiEndpoint: typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? '/api/chat'  // Local development
    : 'https://tedx-chatbot.onrender.com'  // Production GitHub Pages
};
