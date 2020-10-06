import * as vscode from 'vscode';
import * as path from 'path';
import type { Uri, ExtensionContext, WebviewPanel, TextEditor } from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerTextEditorCommand(
    'astscout-vscode.openAstScout',
    (textEditor) => {
      const panel = vscode.window.createWebviewPanel(
        'astScoutMain',
        'AST Scout',
        vscode.ViewColumn.Beside,
        {
          enableScripts: true,
        },
      );

      const bundleUri = getBundleUri(context, panel);

      panel.webview.html = getWebviewContent(textEditor, bundleUri);

      vscode.window.onDidChangeActiveTextEditor((editor) => {
        if (!editor) {
          return;
        }
        panel.webview.html = getWebviewContent(editor, bundleUri);
      });
    },
  );

  context.subscriptions.push(disposable);
}

function getBundleUri(context: ExtensionContext, panel: WebviewPanel) {
  const fullPath = path.join(
    context.extensionPath,
    'node_modules/astscout-vscode-web/dist/bundle.js',
  );
  const uri = vscode.Uri.file(fullPath);
  const bundleUri = panel.webview.asWebviewUri(uri);
  return bundleUri;
}

function getWebviewContent(textEditor: TextEditor, bundleUri: Uri) {
  const code = textEditor.document.getText();
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <link
      href="https://fonts.googleapis.com/css?family=Roboto"
      rel="stylesheet"
    />
    <style type="text/css">
      .code, .controls { font-family: var(--vscode-editor-font-family); font-size: var(--vscode-editor-font-size); font-weight: var(--vscode-editor-font-weight); }
      .controls { display:flow-root; }
      .control { float:left; margin-right:12px; }
      .code { fill: var(--vscode-editor-foreground); }
      .grid-background { fill: var(--vscode-sideBar-background); }
      .cell { fill: var(--vscode-dropdown-foreground); }
      .row line, .column line { stroke: var(--vscode-editor-background); }
      .hover-target { fill: transparent; }
      .hover-highlight { fill:#b3b3b3; fill-opacity:0.25; }
      .error { color: var(--vscode-errorForeground); font-size: var(--vscode-font-size); }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script>
      window.scoutCode = atob('${Buffer.from(code).toString('base64')}');
    </script>
    <script src="${bundleUri}"></script>
  </body>
</html>
`;
}
