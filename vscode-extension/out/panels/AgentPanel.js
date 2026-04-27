"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentPanel = void 0;
class AgentPanel {
    constructor(_extensionUri) {
        this._extensionUri = _extensionUri;
        // Model used for Ollama requests — adjust to whatever you have pulled locally
        this._model = 'qwen2.5-coder:3b';
    }
    resolveWebviewView(webviewView, _context, _token) {
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri],
        };
        webviewView.webview.html = this._getHtml(this._model);
        // Handle messages sent from the webview
        webviewView.webview.onDidReceiveMessage(async (data) => {
            if (data.type === 'sendMessage') {
                try {
                    const res = await fetch('http://localhost:11434/api/generate', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            model: this._model,
                            prompt: data.text,
                            stream: false,
                        }),
                    });
                    if (!res.ok) {
                        throw new Error(`Ollama returned HTTP ${res.status}`);
                    }
                    const json = await res.json();
                    const text = json.response ?? 'No response from model.';
                    webviewView.webview.postMessage({ type: 'response', text });
                }
                catch (err) {
                    const msg = err instanceof Error ? err.message : 'Unknown error';
                    webviewView.webview.postMessage({
                        type: 'error',
                        text: `Could not reach Ollama: ${msg}. Make sure Ollama is running on port 11434.`,
                    });
                }
            }
        });
    }
    _getHtml(model) {
        return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Agentic Dev Tool</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; }

    body {
      font-family: var(--vscode-font-family);
      font-size: var(--vscode-font-size);
      color: var(--vscode-foreground);
      background: var(--vscode-sideBar-background);
      margin: 0;
      padding: 0;
      height: 100vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    /* ── Header ── */
    .header {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 14px 8px;
      border-bottom: 1px solid var(--vscode-sideBarSectionHeader-border);
      flex-shrink: 0;
    }

    .header h2 {
      margin: 0;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--vscode-sideBarTitle-foreground);
      flex: 1;
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      background: var(--vscode-badge-background);
      color: var(--vscode-badge-foreground);
      font-size: 10px;
      padding: 2px 8px;
      border-radius: 10px;
      font-weight: 500;
    }

    .status-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #888;
      transition: background 0.3s ease;
    }
    .status-dot.connected { background: #4caf50; }
    .status-dot.thinking  { background: #ff9800; animation: pulse 1s infinite; }

    @keyframes pulse {
      0%,100% { opacity: 1; } 50% { opacity: 0.25; }
    }

    .model-info {
      padding: 4px 14px 6px;
      font-size: 10px;
      color: var(--vscode-descriptionForeground);
      flex-shrink: 0;
    }

    /* ── Chat ── */
    .chat {
      flex: 1;
      overflow-y: auto;
      padding: 10px 14px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .chat::-webkit-scrollbar { width: 4px; }
    .chat::-webkit-scrollbar-thumb {
      background: var(--vscode-scrollbarSlider-background);
      border-radius: 2px;
    }

    /* Empty state */
    .empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      flex: 1;
      gap: 8px;
      text-align: center;
      color: var(--vscode-descriptionForeground);
      padding: 20px;
    }
    .empty .icon   { font-size: 30px; }
    .empty .title  { font-size: 12px; font-weight: 600; color: var(--vscode-foreground); }
    .empty .sub    { font-size: 11px; line-height: 1.6; }

    /* Messages */
    .msg {
      display: flex;
      flex-direction: column;
      gap: 3px;
      animation: fadeUp 0.18s ease;
    }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(5px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .msg-role {
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--vscode-descriptionForeground);
    }
    .msg.user .msg-role { color: var(--vscode-textLink-foreground); }

    .msg-bubble {
      background: var(--vscode-input-background);
      border: 1px solid var(--vscode-input-border, rgba(128,128,128,0.2));
      border-radius: 6px;
      padding: 9px 11px;
      font-size: 12px;
      line-height: 1.65;
      white-space: pre-wrap;
      word-break: break-word;
    }
    .msg.user .msg-bubble {
      background: var(--vscode-button-background);
      color: var(--vscode-button-foreground);
      border-color: transparent;
    }
    .msg.error .msg-bubble {
      border-color: var(--vscode-inputValidation-errorBorder, #f44);
      background: var(--vscode-inputValidation-errorBackground, rgba(255,0,0,0.05));
    }

    /* Typing indicator */
    .typing {
      display: flex;
      gap: 4px;
      align-items: center;
      padding: 9px 11px;
      background: var(--vscode-input-background);
      border: 1px solid var(--vscode-input-border, rgba(128,128,128,0.2));
      border-radius: 6px;
      width: fit-content;
    }
    .typing span {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: var(--vscode-descriptionForeground);
      animation: bounce 1.2s infinite;
    }
    .typing span:nth-child(2) { animation-delay: 0.2s; }
    .typing span:nth-child(3) { animation-delay: 0.4s; }

    @keyframes bounce {
      0%,80%,100% { transform: translateY(0);    opacity: 0.4; }
      40%          { transform: translateY(-5px); opacity: 1;   }
    }

    /* ── Input area ── */
    .input-area {
      padding: 8px 14px 12px;
      border-top: 1px solid var(--vscode-sideBarSectionHeader-border);
      display: flex;
      flex-direction: column;
      gap: 6px;
      flex-shrink: 0;
    }

    textarea {
      width: 100%;
      background: var(--vscode-input-background);
      color: var(--vscode-input-foreground);
      border: 1px solid var(--vscode-input-border, rgba(128,128,128,0.3));
      border-radius: 5px;
      padding: 7px 9px;
      font-family: inherit;
      font-size: 12px;
      line-height: 1.5;
      resize: none;
      min-height: 56px;
      max-height: 150px;
      outline: none;
      transition: border-color 0.15s;
    }
    textarea:focus { border-color: var(--vscode-focusBorder); }
    textarea::placeholder { color: var(--vscode-input-placeholderForeground); }

    .input-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .hint { font-size: 10px; color: var(--vscode-descriptionForeground); }

    .send-btn {
      background: var(--vscode-button-background);
      color: var(--vscode-button-foreground);
      border: none;
      border-radius: 4px;
      padding: 5px 14px;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.15s, opacity 0.15s;
    }
    .send-btn:hover:not(:disabled) { background: var(--vscode-button-hoverBackground); }
    .send-btn:disabled { opacity: 0.45; cursor: not-allowed; }
  </style>
</head>
<body>

  <div class="header">
    <h2>Agentic Tool</h2>
    <span class="status-badge">
      <span class="status-dot" id="statusDot"></span>
      <span id="statusLabel">Offline</span>
    </span>
  </div>

  <div class="model-info">Model: <strong>${model}</strong> &middot; Ollama</div>

  <div class="chat" id="chat">
    <div class="empty" id="emptyState">
      <span class="icon">🤖</span>
      <span class="title">Agentic Dev Tool</span>
      <span class="sub">Ask anything about your code.<br/>Responses come from your local Ollama LLM.</span>
    </div>
  </div>

  <div class="input-area">
    <textarea id="promptInput" placeholder="Ask a question… (Shift+Enter for new line)" rows="3"></textarea>
    <div class="input-footer">
      <span class="hint">Enter ↵ to send</span>
      <button class="send-btn" id="sendBtn">Send ↑</button>
    </div>
  </div>

  <script>
    const vscode       = acquireVsCodeApi();
    const chat         = document.getElementById('chat');
    const emptyState   = document.getElementById('emptyState');
    const promptInput  = document.getElementById('promptInput');
    const sendBtn      = document.getElementById('sendBtn');
    const statusDot    = document.getElementById('statusDot');
    const statusLabel  = document.getElementById('statusLabel');
    let busy = false;

    // ── Status helper ──────────────────────────────────────────────
    function setStatus(state) {
      statusDot.className = 'status-dot';
      if (state === 'connected') {
        statusDot.classList.add('connected');
        statusLabel.textContent = 'Online';
      } else if (state === 'thinking') {
        statusDot.classList.add('thinking');
        statusLabel.textContent = 'Thinking…';
      } else {
        statusLabel.textContent = 'Offline';
      }
    }

    // ── Remove empty state on first message ───────────────────────
    function clearEmpty() {
      if (emptyState && emptyState.parentNode) {
        emptyState.parentNode.removeChild(emptyState);
      }
    }

    // ── Append a chat message ─────────────────────────────────────
    function appendMessage(role, text, isError) {
      clearEmpty();
      const wrapper = document.createElement('div');
      wrapper.className = 'msg' + (role === 'user' ? ' user' : '') + (isError ? ' error' : '');

      const roleEl = document.createElement('div');
      roleEl.className = 'msg-role';
      roleEl.textContent = role === 'user' ? 'You' : 'Agent';

      const bubble = document.createElement('div');
      bubble.className = 'msg-bubble';
      bubble.textContent = text;

      wrapper.appendChild(roleEl);
      wrapper.appendChild(bubble);
      chat.appendChild(wrapper);
      chat.scrollTop = chat.scrollHeight;
    }

    // ── Typing indicator ──────────────────────────────────────────
    function showTyping() {
      clearEmpty();
      const wrapper = document.createElement('div');
      wrapper.className = 'msg';
      wrapper.id = 'typingIndicator';

      const roleEl = document.createElement('div');
      roleEl.className = 'msg-role';
      roleEl.textContent = 'Agent';

      const ind = document.createElement('div');
      ind.className = 'typing';
      for (let i = 0; i < 3; i++) {
        const s = document.createElement('span');
        ind.appendChild(s);
      }

      wrapper.appendChild(roleEl);
      wrapper.appendChild(ind);
      chat.appendChild(wrapper);
      chat.scrollTop = chat.scrollHeight;
    }

    function removeTyping() {
      const el = document.getElementById('typingIndicator');
      if (el) el.parentNode.removeChild(el);
    }

    // ── Send message ──────────────────────────────────────────────
    function send() {
      const text = promptInput.value.trim();
      if (!text || busy) return;

      appendMessage('user', text);
      promptInput.value = '';
      promptInput.style.height = 'auto';

      busy = true;
      sendBtn.disabled = true;
      setStatus('thinking');
      showTyping();

      vscode.postMessage({ type: 'sendMessage', text });
    }

    promptInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
    });

    promptInput.addEventListener('input', () => {
      promptInput.style.height = 'auto';
      promptInput.style.height = Math.min(promptInput.scrollHeight, 150) + 'px';
    });

    sendBtn.addEventListener('click', send);

    // ── Receive from extension host ───────────────────────────────
    window.addEventListener('message', (event) => {
      const msg = event.data;
      removeTyping();
      busy = false;
      sendBtn.disabled = false;

      if (msg.type === 'response') {
        appendMessage('agent', msg.text, false);
        setStatus('connected');
      } else if (msg.type === 'error') {
        appendMessage('agent', '⚠️ ' + msg.text, true);
        setStatus('offline');
      }
    });
  </script>
</body>
</html>`;
    }
}
exports.AgentPanel = AgentPanel;
AgentPanel.viewType = 'agentic-dev-tool.agentPanel';
//# sourceMappingURL=AgentPanel.js.map