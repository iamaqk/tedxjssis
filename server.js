const http = require('http');
const fs = require('fs');
const path = require('path');
const { Configuration, OpenAIApi } = require('openai');

// Load environment variables from .env.local
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '.env.local') });

const API_KEY = process.env.OPENAI_API_KEY;
const PORT = process.env.PORT || 3000;

// System prompt - you can edit this to customize the chatbot's behavior
const SYSTEM_PROMPT = `You are a helpful assistant for TEDxJSS International School. You represent the TEDx team and help answer questions about:
- TEDx events and speakers
- Our team and organization
- Event registration and details
- General inquiries about TED values and ideas worth spreading

Be friendly, professional, and concise in your responses. If you don't know something specific about the organization, suggest contacting the team directly via the contact page.`;

// Initialize OpenAI
let openai;
if (API_KEY) {
  const configuration = new Configuration({ apiKey: API_KEY });
  openai = new OpenAIApi(configuration);
}

const server = http.createServer(async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // API endpoint for chat
  if (req.url === '/api/chat' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        if (!API_KEY) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'OPENAI_API_KEY not configured' }));
          return;
        }

        const { messages } = JSON.parse(body);

        if (!messages || !Array.isArray(messages)) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Messages array is required' }));
          return;
        }

        // Prepare messages with system prompt
        const formattedMessages = [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages,
        ];

        // Call OpenAI API
        const response = await openai.createChatCompletion({
          model: 'gpt-3.5-turbo',
          messages: formattedMessages,
          temperature: 0.7,
          max_tokens: 150,
        });

        const assistantMessage = response.data.choices[0].message.content;

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: assistantMessage }));
      } catch (error) {
        console.error('Error:', error.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({
            error: error.message || 'Failed to process chat message',
          })
        );
      }
    });
    return;
  }

  // Serve static files
  let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);

  // Security: prevent directory traversal
  if (!filePath.startsWith(path.join(__dirname))) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }

    const ext = path.extname(filePath);
    const contentType = {
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'text/javascript',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.pdf': 'application/pdf',
    }[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`\n✨ Development server running at http://localhost:${PORT}\n`);
  if (!API_KEY) {
    console.warn('⚠️  Warning: OPENAI_API_KEY not set in .env.local');
    console.warn('   Chatbot will not work until API key is configured\n');
  }
});
