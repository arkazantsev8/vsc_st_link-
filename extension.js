const vscode = require('vscode');

function activate(context) {

    let activeEditor = vscode.window.activeTextEditor;

    if (activeEditor) {
        triggerUpdateDecorations();
    }

    vscode.window.onDidChangeActiveTextEditor(editor => {
        activeEditor = editor;
        if (editor) {
            triggerUpdateDecorations();
        }
    }, null, context.subscriptions);

    vscode.workspace.onDidChangeTextDocument(event => {
        if (activeEditor && event.document === activeEditor.document) {
            triggerUpdateDecorations();
        }
    }, null, context.subscriptions);

    var timeout = null;
    function triggerUpdateDecorations() {
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(updateDecorations, 500);
    }

    let linkDecorationType = vscode.window.createTextEditorDecorationType({
        textDecoration: 'underline',
        overviewRulerColor: 'blue',
        overviewRulerLane: vscode.OverviewRulerLane.Right,
        rangeBehavior: vscode.DecorationRangeBehavior.OpenOpen
    });

    function updateDecorations() {
        if (!activeEditor) {
            return;
        }
        // Updating the regular expression to look for any number of latin letters, 
        // followed by a dash, followed by any number of digits.
        const regEx = /\b[A-Za-z]+-\d+\b/g;
        const text = activeEditor.document.getText();
        const links = [];
        let match;
        while (match = regEx.exec(text)) {
            const startPos = activeEditor.document.positionAt(match.index);
            const endPos = activeEditor.document.positionAt(match.index + match[0].length);
            const decoration = { range: new vscode.Range(startPos, endPos), hoverMessage: `Go to https://st.yandex-team.ru/${match[0]}` };
            links.push(decoration);
        }

        activeEditor.setDecorations(linkDecorationType, links);
    }
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
}
