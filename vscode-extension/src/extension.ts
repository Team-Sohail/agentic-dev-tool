import * as vscode from 'vscode';
import { AgentPanel } from './panels/AgentPanel';

export function activate(context: vscode.ExtensionContext) {
  console.log('Agentic Dev Tool is now active.');

  // Register the Hello World command
  const helloCommand = vscode.commands.registerCommand(
    'agentic-dev-tool.helloWorld',
    () => {
      console.log('Hello World command executed!');
      vscode.window.showInformationMessage('Hello from Agentic Dev Tool! 🤖');
    }
  );
  context.subscriptions.push(helloCommand);

  // Register the sidebar webview panel provider
  const agentPanelProvider = new AgentPanel(context.extensionUri);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      AgentPanel.viewType,
      agentPanelProvider
    )
  );
}

export function deactivate() {
  console.log('Agentic Dev Tool deactivated.');
}