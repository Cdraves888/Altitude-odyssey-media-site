// Altitude Odyssey Media — AI Chat Bubble
// Powered by Claude (Anthropic)
(function () {
  const WORKER_URL = 'https://aom-chat.eaglelover888.workers.dev';
  const messages = [];

  // Inject styles
  const style = document.createElement('style');
  style.textContent = `
    #aom-chat-bubble {
      position: fixed;
      bottom: 28px;
      right: 28px;
      z-index: 9999;
      font-family: 'Raleway', sans-serif;
    }
    #aom-chat-toggle {
      width: 58px;
      height: 58px;
      border-radius: 50%;
      background: linear-gradient(135deg, #c9a84c, #e2c47a);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 20px rgba(201,168,76,0.4);
      transition: transform 0.2s, box-shadow 0.2s;
      margin-left: auto;
    }
    #aom-chat-toggle:hover {
      transform: scale(1.08);
      box-shadow: 0 6px 28px rgba(201,168,76,0.55);
    }
    #aom-chat-toggle svg {
      width: 26px;
      height: 26px;
      fill: #0a0806;
    }
    #aom-chat-window {
      display: none;
      flex-direction: column;
      width: 340px;
      height: 480px;
      background: #0f0d0a;
      border: 1px solid rgba(201,168,76,0.25);
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 12px 48px rgba(0,0,0,0.6);
      margin-bottom: 12px;
    }
    #aom-chat-window.open {
      display: flex;
    }
    #aom-chat-header {
      background: linear-gradient(135deg, #1a1508, #0f0d0a);
      border-bottom: 1px solid rgba(201,168,76,0.2);
      padding: 14px 18px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    #aom-chat-header .aom-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: linear-gradient(135deg, #c9a84c, #e2c47a);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      color: #0a0806;
      font-weight: 700;
    }
    #aom-chat-header .aom-header-text h4 {
      margin: 0;
      font-family: 'Cinzel', serif;
      font-size: 13px;
      color: #c9a84c;
      letter-spacing: 0.05em;
    }
    #aom-chat-header .aom-header-text p {
      margin: 0;
      font-size: 11px;
      color: rgba(212,201,176,0.5);
    }
    #aom-chat-header .aom-close {
      margin-left: auto;
      background: none;
      border: none;
      color: rgba(212,201,176,0.4);
      font-size: 20px;
      cursor: pointer;
      line-height: 1;
      padding: 0;
    }
    #aom-chat-header .aom-close:hover {
      color: #c9a84c;
    }
    #aom-chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      scrollbar-width: thin;
      scrollbar-color: rgba(201,168,76,0.2) transparent;
    }
    .aom-msg {
      max-width: 85%;
      padding: 10px 14px;
      border-radius: 12px;
      font-size: 13px;
      line-height: 1.5;
    }
    .aom-msg.bot {
      background: rgba(201,168,76,0.08);
      border: 1px solid rgba(201,168,76,0.15);
      color: #d4c9b0;
      align-self: flex-start;
      border-bottom-left-radius: 4px;
    }
    .aom-msg.user {
      background: rgba(201,168,76,0.18);
      color: #fffaf4;
      align-self: flex-end;
      border-bottom-right-radius: 4px;
    }
    .aom-typing {
      display: flex;
      gap: 4px;
      padding: 10px 14px;
      align-self: flex-start;
    }
    .aom-typing span {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #c9a84c;
      opacity: 0.5;
      animation: aomDot 1.2s infinite;
    }
    .aom-typing span:nth-child(2) { animation-delay: 0.2s; }
    .aom-typing span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes aomDot {
      0%, 80%, 100% { transform: scale(0.8); opacity: 0.3; }
      40% { transform: scale(1.1); opacity: 1; }
    }
    #aom-chat-input-row {
      border-top: 1px solid rgba(201,168,76,0.15);
      padding: 12px 14px;
      display: flex;
      gap: 8px;
      align-items: center;
      background: #0a0806;
    }
    #aom-chat-input {
      flex: 1;
      background: rgba(201,168,76,0.06);
      border: 1px solid rgba(201,168,76,0.2);
      border-radius: 8px;
      padding: 9px 12px;
      color: #d4c9b0;
      font-family: 'Raleway', sans-serif;
      font-size: 13px;
      outline: none;
      resize: none;
      height: 38px;
      line-height: 1.4;
    }
    #aom-chat-input::placeholder { color: rgba(212,201,176,0.35); }
    #aom-chat-input:focus { border-color: rgba(201,168,76,0.45); }
    #aom-chat-send {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background: linear-gradient(135deg, #c9a84c, #e2c47a);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: opacity 0.2s;
    }
    #aom-chat-send:hover { opacity: 0.85; }
    #aom-chat-send:disabled { opacity: 0.4; cursor: default; }
    #aom-chat-send svg {
      width: 16px;
      height: 16px;
      fill: #0a0806;
    }

    @media (max-width: 480px) {
      #aom-chat-bubble {
        bottom: 0;
        right: 0;
        left: 0;
        width: 100%;
      }

      #aom-chat-window {
        width: 100%;
        height: 100dvh;
        border-radius: 0;
        border: none;
        margin-bottom: 0;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
      }

      #aom-chat-toggle {
        position: fixed;
        bottom: 20px;
        right: 20px;
        margin-left: 0;
      }
    }
  `;
  document.head.appendChild(style);

  // Build HTML
  const bubble = document.createElement('div');
  bubble.id = 'aom-chat-bubble';
  bubble.innerHTML = `
    <div id="aom-chat-window">
      <div id="aom-chat-header">
        <div class="aom-avatar">J</div>
        <div class="aom-header-text">
          <h4>Jess</h4>
          <p>AI Assistant · Usually replies instantly</p>
        </div>
        <button class="aom-close" id="aom-close-btn">&times;</button>
      </div>
      <div id="aom-chat-messages"></div>
      <div id="aom-chat-input-row">
        <textarea id="aom-chat-input" placeholder="Ask about our services..." rows="1"></textarea>
        <button id="aom-chat-send">
          <svg viewBox="0 0 24 24"><path d="M2 21l21-9L2 3v7l15 2-15 2z"/></svg>
        </button>
      </div>
    </div>
    <button id="aom-chat-toggle" aria-label="Open chat">
      <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>
    </button>
  `;
  document.body.appendChild(bubble);

  const chatWindow = document.getElementById('aom-chat-window');
  const toggleBtn  = document.getElementById('aom-chat-toggle');
  const closeBtn   = document.getElementById('aom-close-btn');
  const messagesEl = document.getElementById('aom-chat-messages');
  const input      = document.getElementById('aom-chat-input');
  const sendBtn    = document.getElementById('aom-chat-send');

  function addMessage(role, text) {
    const div = document.createElement('div');
    div.className = `aom-msg ${role}`;
    div.textContent = text;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return div;
  }

  function showTyping() {
    const div = document.createElement('div');
    div.className = 'aom-typing';
    div.innerHTML = '<span></span><span></span><span></span>';
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return div;
  }

  function openChat() {
    chatWindow.classList.add('open');
    if (messages.length === 0) {
      addMessage('bot', 'Hi! I\'m Jess, the Altitude Odyssey Media AI assistant. Ask me anything about our web design services, pricing, or how to get started. 🌟');
    }
    input.focus();
  }

  toggleBtn.addEventListener('click', openChat);
  closeBtn.addEventListener('click', () => chatWindow.classList.remove('open'));

  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    sendBtn.disabled = true;
    addMessage('user', text);
    messages.push({ role: 'user', content: text });
    const typing = showTyping();
    try {
      const res = await fetch(WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || 'Sorry, something went wrong. Please email studio@altitudeodysseymedia.com directly.';
      typing.remove();
      addMessage('bot', reply);
      messages.push({ role: 'assistant', content: reply });
    } catch (e) {
      typing.remove();
      addMessage('bot', 'Connection issue — please email studio@altitudeodysseymedia.com directly.');
    }
    sendBtn.disabled = false;
    input.focus();
  }

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
})();
