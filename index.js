// Groq API Configuration
const GROQ_API_BASE = 'https://api.groq.com/openai/v1';

// API Key Configuration
// Set your Groq API key directly here, or leave as undefined to load from ./apikey file
const GROQ_API_KEY_DIRECT = "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"; // Replace undefined with your API key string, e.g., 'your-api-key-here'

let GROQ_API_KEY = ''; // Will be set from GROQ_API_KEY_DIRECT or loaded from file

// Agent Configuration
// Customize these settings to define your chatbot's personality and behavior
const AGENT_CONFIG = {
    // Model to use (e.g., 'llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768')
    model: 'openai/gpt-oss-20b',
    
    // System prompt - defines the agent's role, personality, and behavior
    // This is sent as a system message in the messages array
    systemPrompt: `TEDxJSSInternationalSchool Chatbot

Core Behavior Rules
	•	Any query not related to the event should be politely declined with a brief explanation that you are focused on providing information about TEDxJSSInternationalSchool.
	•	Always respond politely, calmly, and positively, even if the user is negative, critical, sarcastic, or rude.
	•	Never argue, escalate, shame, or dismiss a user.
	•	Reframe negative comments into constructive, respectful responses.
	•	If a question is controversial, sensitive, or unclear, give a neutral, balanced, and factual answer.
	•	If information is unknown, respond honestly and neutrally without guessing.
	•	Maintain a friendly, confident, and helpful tone at all times (“grace under pressure”).

⸻

Event Information (Use consistently)
	•	Event Name: TEDxJSSInternationalSchool
	•	Theme: Breaking the Silence
	•	Date: Friday, 9th January 2026
	•	Time: 4:00 PM – 8:00 PM
	•	Venue: JSS International School, JVC, Dubai
	•	Google Maps Location:
https://www.google.com/maps/search/JSS+International+School+JVC+Dubai

⸻

Theme Guidance: Breaking the Silence
	•	Represents courage, conversation, and the power of speaking up.
	•	Highlights untold stories, overlooked ideas, and voices that deserve to be heard.
	•	Explain the theme in an inspiring, inclusive, and hopeful way.
	•	Do not reveal speaker-specific content unless officially confirmed.
	•	Connect the theme to dialogue, awareness, empathy, innovation, and positive change.

⸻

Ticket Pricing (Always accurate)
	•	Pre-booking price: AED 25
	•	On-the-day price: AED 30

⸻

Ticket-Related Responses
	•	Encourage pre-booking politely, without pressure.
	•	Clearly explain the price difference if asked.
	•	If someone complains about pricing, acknowledge their concern and highlight the value of the experience, ideas, and community.

⸻

Contact Information
	•	Official Email: tedx.jssis25@gmail.com
	•	Invite users to reach out via email for inquiries, collaborations, or support.
	•	Do not provide or invent a phone number under any circumstances.
	•	If asked for a phone number, politely explain that email is the primary contact method at this time.

⸻

Negative Comment Handling (Very Important)
	•	Complaints: Acknowledge + reassure
	•	Insults: Stay calm, respectful, professional
	•	Mockery: Respond with positivity and inclusivity
	•	Quality doubts: Emphasize learning, ideas, and shared growth

Never mirror negativity. Be the emotional adult in the room.

⸻

Tone Guide
	•	Warm, professional, optimistic
	•	Clear and concise
	•	Slightly enthusiastic, never defensive`,
    
    // Additional instructions for response style and guidelines
    // These can be included in the system prompt or kept separate
    responseGuidelines: `Follow these guidelines when responding:
1. Be concise but thorough - provide enough detail to be helpful without being verbose
2. Use clear, simple language that's easy to understand
3. If asked about something you're uncertain about, acknowledge the uncertainty
4. Maintain a friendly and professional tone
5. Structure longer responses with clear formatting when helpful
6. Ask clarifying questions if the user's request is ambiguous`,
    
    // Temperature: Controls randomness (0.0 = deterministic, 2.0 = very creative)
    // Recommended range: 0.7 - 1.0 for balanced responses
    temperature: 0.7,
    
    // Maximum output tokens (null = no limit, set a number to limit response length)
    // Note: Groq uses 'max_tokens' parameter
    maxOutputTokens: null
};

// Chat state
let chatState = {
    isOpen: false,
    isProcessing: false,
    conversationHistory: [] // Stores messages in format: { role: 'user'|'assistant'|'system', content: string }
};

// Initialize the chat widget
async function initializeChatWidget() {
    // Load API key - check direct setting first, then try file
    if (GROQ_API_KEY_DIRECT && GROQ_API_KEY_DIRECT.trim()) {
        GROQ_API_KEY = GROQ_API_KEY_DIRECT.trim();
        console.log('API key loaded from direct configuration');
    } else {
        try {
            await loadApiKey();
            console.log('API key loaded from file');
        } catch (error) {
            console.error('Failed to load API key:', error);
            console.error('Please set GROQ_API_KEY_DIRECT in the configuration section or ensure ./apikey file exists');
            alert('API key is required. Please set GROQ_API_KEY_DIRECT in index.js or create an ./apikey file.');
            return;
        }
    }

    if (!GROQ_API_KEY) {
        console.error('Groq API key is required');
        alert('API key is required. Please set GROQ_API_KEY_DIRECT in index.js or create an ./apikey file.');
        return;
    }

    // Initialize conversation with system message
    const fullSystemPrompt = `${AGENT_CONFIG.systemPrompt}\n\n${AGENT_CONFIG.responseGuidelines}`;
    chatState.conversationHistory.push({
        role: 'system',
        content: fullSystemPrompt
    });

    // Create chat widget HTML
    createChatWidget();
    
    // Add event listeners
    setupEventListeners();
}

// Load API key from file securely
async function loadApiKey() {
    try {
        const response = await fetch('./apikey');
        if (!response.ok) {
            throw new Error('Failed to load API key file');
        }
        const apiKey = await response.text();
        GROQ_API_KEY = apiKey.trim();
        
        if (!GROQ_API_KEY) {
            throw new Error('API key file is empty');
        }
    } catch (error) {
        console.warn('Could not load API key from file:', error);
        throw error;
    }
}

// Create the chat widget DOM structure
function createChatWidget() {
    // Create chat button
    const chatButton = document.createElement('div');
    chatButton.id = 'chatButton';
    chatButton.className = 'chat-button';
    chatButton.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
    `;

    // Create chat window
    const chatWindow = document.createElement('div');
    chatWindow.id = 'chatWindow';
    chatWindow.className = 'chat-window';
    chatWindow.innerHTML = `
        <div class="chat-header">
            <h3>TEDx Guide</h3>
            <button id="closeChat" class="close-button">×</button>
        </div>
        <div id="chatMessages" class="chat-messages"></div>
        <div class="chat-input-container">
            <input 
                type="text" 
                id="chatInput" 
                class="chat-input" 
                placeholder="Type your message..."
                autocomplete="off"
            />
            <button id="sendButton" class="send-button">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
            </button>
        </div>
    `;

    // Append to body
    document.body.appendChild(chatButton);
    document.body.appendChild(chatWindow);

    // Inject styles
    injectStyles();
}

// Inject CSS styles
function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .chat-button {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 60px;
            height: 60px;
            background-color: #ff4444;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(255, 68, 68, 0.4);
            transition: transform 0.3s, box-shadow 0.3s;
            z-index: 1000;
            color: white;
            font-weight: 600;
        }

        .chat-button:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 20px rgba(255, 68, 68, 0.6);
        }

        .chat-window {
            position: fixed;
            bottom: 110px;
            right: 30px;
            width: 400px;
            height: 500px;
            background: linear-gradient(135deg, rgba(45, 45, 45, 0.95) 0%, rgba(30, 30, 30, 0.95) 100%);
            backdrop-filter: blur(18px) saturate(180%);
            border-radius: 16px;
            border: 1px solid rgba(255, 68, 68, 0.2);
            box-shadow: 0 8px 32px rgba(255, 68, 68, 0.15);
            display: none;
            flex-direction: column;
            z-index: 1001;
            overflow: hidden;
        }

        .chat-window.open {
            display: flex;
            animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .chat-header {
            background: linear-gradient(135deg, #ff4444, #cc3333);
            color: white;
            padding: 16px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid rgba(255, 68, 68, 0.3);
        }

        .chat-header h3 {
            margin: 0;
            font-size: 18px;
            font-weight: 600;
        }

        .close-button {
            background: none;
            border: none;
            color: white;
            font-size: 28px;
            cursor: pointer;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: background 0.2s;
        }

        .close-button:hover {
            background: rgba(255, 255, 255, 0.2);
        }

        .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            background: rgba(0, 0, 0, 0.2);
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .chat-messages::-webkit-scrollbar {
            width: 6px;
        }

        .chat-messages::-webkit-scrollbar-track {
            background: rgba(255, 68, 68, 0.1);
            border-radius: 10px;
        }

        .chat-messages::-webkit-scrollbar-thumb {
            background: #ff4444;
            border-radius: 10px;
        }

        .chat-messages::-webkit-scrollbar-thumb:hover {
            background: #cc3333;
        }

        .message {
            display: flex;
            align-items: flex-start;
            animation: fadeIn 0.3s ease-in;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .message.user {
            justify-content: flex-end;
        }

        .message-content {
            max-width: 80%;
            padding: 12px 16px;
            border-radius: 12px;
            word-wrap: break-word;
            line-height: 1.4;
            font-size: 14px;
        }

        .message.user .message-content {
            background: linear-gradient(135deg, #ff4444, #cc3333);
            color: white;
            border-bottom-right-radius: 4px;
            box-shadow: 0 2px 8px rgba(255, 68, 68, 0.3);
        }

        .message.bot .message-content {
            background: rgba(255, 255, 255, 0.08);
            color: #e0e0e0;
            border-bottom-left-radius: 4px;
            border: 1px solid rgba(255, 68, 68, 0.2);
        }

        .message-content p {
            margin: 0 0 8px 0;
        }

        .message-content p:last-child {
            margin-bottom: 0;
        }

        .message-content code {
            background: rgba(0, 0, 0, 0.1);
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
        }

        .message.user .message-content code {
            background: rgba(255, 255, 255, 0.2);
        }

        .message-content pre {
            background: rgba(0, 0, 0, 0.05);
            padding: 12px;
            border-radius: 8px;
            overflow-x: auto;
            margin: 8px 0;
        }

        .message.user .message-content pre {
            background: rgba(255, 255, 255, 0.15);
        }

        .message-content pre code {
            background: none;
            padding: 0;
        }

        .message-content h1,
        .message-content h2,
        .message-content h3 {
            margin: 12px 0 8px 0;
            font-weight: 600;
        }

        .message-content h1 {
            font-size: 1.5em;
        }

        .message-content h2 {
            font-size: 1.3em;
        }

        .message-content h3 {
            font-size: 1.1em;
        }

        .message-content a {
            color: #4a90e2;
            text-decoration: none;
        }

        .message.user .message-content a {
            color: #88c0ff;
        }

        .message-content a:hover {
            text-decoration: underline;
        }

        .message-content strong {
            font-weight: 600;
        }

        .message-content em {
            font-style: italic;
        }

        .message-avatar {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 8px;
            flex-shrink: 0;
            stroke-width: 2;
        }

        .message.user .message-avatar {
            background: #2d2d2d;
            color: white;
            order: 2;
        }

        .message.bot .message-avatar {
            background: #e0e0e0;
            color: #2d2d2d;
        }

        .chat-input-container {
            display: flex;
            padding: 16px;
            background: white;
            border-top: 1px solid #e0e0e0;
            gap: 8px;
        }

        .chat-input {
            flex: 1;
            padding: 12px 16px;
            border: 2px solid #e0e0e0;
            border-radius: 24px;
            font-size: 14px;
            outline: none;
            transition: border-color 0.2s;
            background: white;
            color: #2d2d2d;
        }

        .chat-input:focus {
            border-color: #2d2d2d;
        }

        .send-button {
            width: 44px;
            height: 44px;
            border-radius: 50%;
            background: #2d2d2d;
            border: none;
            color: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
        }

        .send-button:hover:not(:disabled) {
            transform: scale(1.05);
            box-shadow: 0 4px 12px rgba(45, 45, 45, 0.4);
            background: #3d3d3d;
        }

        .send-button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .loading-indicator {
            display: flex;
            gap: 4px;
            padding: 12px 16px;
        }

        .loading-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #2d2d2d;
            animation: bounce 1.4s infinite ease-in-out both;
        }

        .loading-dot:nth-child(1) {
            animation-delay: -0.32s;
        }

        .loading-dot:nth-child(2) {
            animation-delay: -0.16s;
        }

        @keyframes bounce {
            0%, 80%, 100% {
                transform: scale(0);
            }
            40% {
                transform: scale(1);
            }
        }

        .error-message {
            color: #dc3545;
            padding: 12px;
            background: #f8d7da;
            border-radius: 8px;
            margin: 8px 0;
            font-size: 14px;
        }

        @media (max-width: 480px) {
            .chat-window {
                width: calc(100% - 40px);
                height: calc(100vh - 120px);
                bottom: 90px;
                right: 20px;
                left: 20px;
            }
        }
    `;
    document.head.appendChild(style);
}

// Setup event listeners
function setupEventListeners() {
    const chatButton = document.getElementById('chatButton');
    const closeButton = document.getElementById('closeChat');
    const sendButton = document.getElementById('sendButton');
    const chatInput = document.getElementById('chatInput');

    // Toggle chat window
    chatButton.addEventListener('click', toggleChat);
    closeButton.addEventListener('click', toggleChat);

    // Send message on button click
    sendButton.addEventListener('click', handleSendMessage);

    // Send message on Enter key
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    });
}

// Toggle chat window
function toggleChat() {
    chatState.isOpen = !chatState.isOpen;
    const chatWindow = document.getElementById('chatWindow');
    const chatInput = document.getElementById('chatInput');

    if (chatState.isOpen) {
        chatWindow.classList.add('open');
        chatInput.focus();
        
        // Show welcome message if chat is empty (only system message exists)
        // System message is at index 0, so length 1 means no user messages yet
        if (chatState.conversationHistory.length === 1) {
            addMessage('Hi! I’m TEDx Guide 👋\nI’m here to help you with any questions about TEDx JSS International School Youth.', false);
        }
    } else {
        chatWindow.classList.remove('open');
    }
}

// Parse markdown to HTML
function parseMarkdown(text) {
    if (!text) return '';
    
    // Escape HTML first to prevent XSS
    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
    
    // Replace code blocks first (preserve them)
    const codeBlocks = [];
    let html = text.replace(/```([\s\S]*?)```/g, (match, code) => {
        const index = codeBlocks.length;
        codeBlocks.push(escapeHtml(code));
        return `__CODEBLOCK_${index}__`;
    });
    
    // Replace inline code (preserve them)
    const inlineCodes = [];
    html = html.replace(/`([^`\n]+)`/g, (match, code) => {
        const index = inlineCodes.length;
        inlineCodes.push(escapeHtml(code));
        return `__INLINECODE_${index}__`;
    });
    
    // Escape remaining HTML
    html = escapeHtml(html);
    
    // Restore code blocks
    codeBlocks.forEach((code, index) => {
        html = html.replace(`__CODEBLOCK_${index}__`, `<pre><code>${code}</code></pre>`);
    });
    
    // Restore inline codes
    inlineCodes.forEach((code, index) => {
        html = html.replace(`__INLINECODE_${index}__`, `<code>${code}</code>`);
    });
    
    // Headers (only if not inside code blocks)
    html = html.replace(/^### (.*)$/gm, (match, content) => {
        return content.includes('<code>') ? match : `<h3>${content}</h3>`;
    });
    html = html.replace(/^## (.*)$/gm, (match, content) => {
        return content.includes('<code>') ? match : `<h2>${content}</h2>`;
    });
    html = html.replace(/^# (.*)$/gm, (match, content) => {
        return content.includes('<code>') ? match : `<h1>${content}</h1>`;
    });
    
    // Bold (**text** or __text__) - process before italic
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>');
    
    // Italic (*text* or _text_) - only if not already bold
    html = html.replace(/\*([^*\n]+)\*/g, (match, content) => {
        return content.includes('<strong>') ? match : `<em>${content}</em>`;
    });
    html = html.replace(/_([^_\n]+)_/g, (match, content) => {
        return content.includes('<strong>') || content.includes('<code>') ? match : `<em>${content}</em>`;
    });
    
    // Links [text](url)
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    
    // Line breaks
    // Split by code blocks to preserve them
    const preBlocks = [];
    html = html.replace(/<pre>[\s\S]*?<\/pre>/g, (match) => {
        const index = preBlocks.length;
        preBlocks.push(match);
        return `__PREBLOCK_${index}__`;
    });
    
    // Process line breaks
    html = html.replace(/\n\n+/g, '</p><p>');
    html = html.replace(/\n/g, '<br>');
    
    // Restore pre blocks
    preBlocks.forEach((block, index) => {
        html = html.replace(`__PREBLOCK_${index}__`, block);
    });
    
    // Wrap in paragraph tags
    if (!html.trim().startsWith('<')) {
        html = '<p>' + html + '</p>';
    }
    
    // Clean up
    html = html.replace(/<p><\/p>/g, '');
    html = html.replace(/<p>(<pre>)/g, '$1');
    html = html.replace(/(<\/pre>)<\/p>/g, '$1');
    html = html.replace(/<p>(<h[1-6]>)/g, '$1');
    html = html.replace(/(<\/h[1-6]>)<\/p>/g, '$1');
    
    return html;
}

// Add message to chat
function addMessage(content, isUser = false) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    
    // Add SVG icons instead of text
    if (isUser) {
        avatar.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
            </svg>
        `;
    } else {
        avatar.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
        `;
    }

    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    // Parse markdown for bot messages, plain text for user messages
    if (isUser) {
        messageContent.textContent = content;
    } else {
        messageContent.innerHTML = parseMarkdown(content);
    }

    messageDiv.appendChild(avatar);
    messageDiv.appendChild(messageContent);
    chatMessages.appendChild(messageDiv);

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Store in conversation history (skip system messages as they're already there)
    if (isUser) {
        chatState.conversationHistory.push({ role: 'user', content });
    } else {
        chatState.conversationHistory.push({ role: 'assistant', content });
    }
}

// Show loading indicator
function showLoadingIndicator() {
    const chatMessages = document.getElementById('chatMessages');
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loadingIndicator';
    loadingDiv.className = 'message bot';

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
            <line x1="8" y1="21" x2="16" y2="21"></line>
            <line x1="12" y1="17" x2="12" y2="21"></line>
        </svg>
    `;

    const loadingContent = document.createElement('div');
    loadingContent.className = 'message-content';
    loadingContent.innerHTML = `
        <div class="loading-indicator">
            <div class="loading-dot"></div>
            <div class="loading-dot"></div>
            <div class="loading-dot"></div>
        </div>
    `;

    loadingDiv.appendChild(avatar);
    loadingDiv.appendChild(loadingContent);
    chatMessages.appendChild(loadingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Remove loading indicator
function removeLoadingIndicator() {
    const loadingIndicator = document.getElementById('loadingIndicator');
    if (loadingIndicator) {
        loadingIndicator.remove();
    }
}

// Show error message
function showError(errorText) {
    removeLoadingIndicator();
    const chatMessages = document.getElementById('chatMessages');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = `Error: ${errorText}`;
    chatMessages.appendChild(errorDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Handle send message
async function handleSendMessage() {
    const chatInput = document.getElementById('chatInput');
    const sendButton = document.getElementById('sendButton');
    const message = chatInput.value.trim();

    if (!message || chatState.isProcessing) {
        return;
    }

    // Add user message to chat
    addMessage(message, true);
    chatInput.value = '';
    
    // Disable input
    chatState.isProcessing = true;
    chatInput.disabled = true;
    sendButton.disabled = true;

    // Show loading indicator
    showLoadingIndicator();

    try {
        // Create response using Groq API
        const response = await createResponse(message);
        
        // Handle the response
        if (response && response.choices && response.choices.length > 0) {
            const botMessage = response.choices[0].message.content;
            removeLoadingIndicator();
            if (botMessage) {
                addMessage(botMessage, false);
            }
        } else {
            throw new Error('Invalid response from API');
        }
    } catch (error) {
        console.error('Error:', error);
        showError(error.message || 'Failed to get response. Please try again.');
    } finally {
        // Re-enable input
        chatState.isProcessing = false;
        chatInput.disabled = false;
        sendButton.disabled = false;
        chatInput.focus();
    }
}

// Create a response using Groq API
async function createResponse(userMessage) {
    // Build messages array: system message + conversation history (user message already added)
    // The user message is already in conversationHistory from addMessage() call
    const messages = chatState.conversationHistory.filter(
        msg => msg.role === 'system' || msg.role === 'user' || msg.role === 'assistant'
    );
    
    const requestBody = {
        model: AGENT_CONFIG.model,
        messages: messages,
        stream: false
    };

    // Add temperature if configured
    if (AGENT_CONFIG.temperature !== undefined) {
        requestBody.temperature = AGENT_CONFIG.temperature;
    }

    // Add max tokens if configured (Groq uses 'max_tokens')
    if (AGENT_CONFIG.maxOutputTokens !== null) {
        requestBody.max_tokens = AGENT_CONFIG.maxOutputTokens;
    }

    const response = await fetch(`${GROQ_API_BASE}/chat/completions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
}


