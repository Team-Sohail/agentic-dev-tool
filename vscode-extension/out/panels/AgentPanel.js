"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentPanel = void 0;
class AgentPanel {
    constructor(_extensionUri) {
        this._extensionUri = _extensionUri;
    }
    resolveWebviewView(webviewView, _context, _token) {
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri],
        };
        webviewView.webview.html = this._getHtml();
    }
    _getHtml() {
        return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Agentic Dev Tool</title>
  <style>
    body {
      font-family: var(--vscode-font-family);
      font-size: var(--vscode-font-size);
      color: var(--vscode-foreground);
      background: var(--vscode-sideBar-background);
      margin: 0;
      padding: 16px;
      box-sizing: border-box;
    }

    .header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid var(--vscode-sideBarSectionHeader-border);
    }

    .header h2 {
      margin: 0;
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--vscode-sideBarTitle-foreground);
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
      background: var(--vscode-notificationsWarningIcon-foreground);
    }

    .placeholder-card {
      background: var(--vscode-input-background);
      border: 1px solid var(--vscode-input-border, rgba(128,128,128,0.2));
      border-radius: 6px;
      padding: 20px 16px;
      text-align: center;
    }

    .placeholder-icon {
      font-size: 28px;
      margin-bottom: 10px;
      display: block;
    }

    .placeholder-title {
      font-size: 13px;
      font-weight: 600;
      color: var(--vscode-foreground);
      margin: 0 0 6px 0;
    }

    .placeholder-subtitle {
      font-size: 11px;
      color: var(--vscode-descriptionForeground);
      margin: 0;
      line-height: 1.5;
    }

    .coming-soon-list {
      margin-top: 16px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .coming-soon-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 11px;
      color: var(--vscode-descriptionForeground);
      padding: 6px 10px;
      background: var(--vscode-input-background);
      border: 1px solid var(--vscode-input-border, rgba(128,128,128,0.15));
      border-radius: 4px;
      opacity: 0.7;
    }
  </style>
</head>
<body>
  <div class="header">
    <h2>Agentic Tool</h2>
    <span class="status-badge">
      <span class="status-dot"></span>
      Offline
    </span>
  </div>

  <div class="placeholder-card">
    <span class="placeholder-icon">🤖</span>
    <p class="placeholder-title">Agentic Dev Tool</p>
    <p class="placeholder-subtitle">Server connection coming soon.<br/>AI-powered coding agent will appear here.</p>
  </div>

  <div class="coming-soon-list">
    <div class="coming-soon-item">⚡ AI code generation</div>
    <div class="coming-soon-item">🔍 Diff review &amp; approval</div>
    <div class="coming-soon-item">🛠 MCP tool integration</div>
  </div>
</body>
</html>`;
    }
}
exports.AgentPanel = AgentPanel;
AgentPanel.viewType = 'agentic-dev-tool.agentPanel';
//# sourceMappingURL=AgentPanel.js.map