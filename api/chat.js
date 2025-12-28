import { Configuration, OpenAIApi } from 'openai';

// System prompt - you can edit this to customize the chatbot's behavior
const SYSTEM_PROMPT = `You are a helpful assistant for TEDxJSS International School. You represent the TEDx team and help answer questions about:
- TEDx events and speakers
- Our team and organization
- Event registration and details
- General inquiries about TED values and ideas worth spreading

Be friendly, professional, and concise in your responses. If you don't know something specific about the organization, suggest contacting the team directly via the contact page.`;

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body;

    // Validate input
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    // Check for API key
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('OPENAI_API_KEY is not set');
      return res.status(500).json({ error: 'API configuration error' });
    }

    // Initialize OpenAI
    const configuration = new Configuration({
      apiKey: apiKey,
    });
    const openai = new OpenAIApi(configuration);

    // Prepare messages with system prompt
    const formattedMessages = [
      {
        role: 'system',
        content: SYSTEM_PROMPT,
      },
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

    return res.status(200).json({
      message: assistantMessage,
    });
  } catch (error) {
    console.error('OpenAI API error:', error);
    
    if (error.response) {
      return res.status(error.response.status).json({
        error: error.response.data.error.message || 'API error occurred',
      });
    }

    return res.status(500).json({
      error: 'Failed to process chat message',
    });
  }
}
