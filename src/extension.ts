import * as vscode from 'vscode';
import {latexSymbols} from './latex';
import {LatexCompletionItemProvider} from './completion'

const RE_LATEX_NAME = /(\\\S+)/g;

let latexItems: vscode.QuickPickItem[] = [];
let pickOptions: vscode.QuickPickOptions = {
    matchOnDescription: true,
};
var latexSymbols2: { [name:string]: string} = {};

export function activate(context: vscode.ExtensionContext) {

    latexItems = [];
    for (let name in latexSymbols) {
        latexItems.push({
            description: name,
            label: latexSymbols[name],
        });
        latexSymbols2[latexSymbols[name]] = name;
    }

    let insertion = vscode.commands.registerCommand('unicode-latex.insertMathSymbol', () => {
        vscode.window.showQuickPick(latexItems, pickOptions).then(insertSymbol);
    });
    let replacement = vscode.commands.registerCommand('unicode-latex.replaceLatexNames', () => {
        replaceWithUnicode(vscode.window.activeTextEditor);
    });
    let showLatex = vscode.commands.registerCommand('unicode-latex.showLatexCode', () => {
        appendLatexOfUnicode(vscode.window.activeTextEditor);
    });

    const selector: vscode.DocumentSelector = ['plaintext', 'markdown', 'coq'];
    const provider = new LatexCompletionItemProvider(latexSymbols);
    let completionSub = vscode.languages.registerCompletionItemProvider(selector, provider, '\\');

    context.subscriptions.push(insertion);
    context.subscriptions.push(replacement);
    context.subscriptions.push(showLatex);
    context.subscriptions.push(completionSub);
}

function insertSymbol(item: vscode.QuickPickItem) {
    if (!item) { return; }
    let editor = vscode.window.activeTextEditor;
    if (!editor) { return; }

    editor.edit( (editBuilder) => {
        editBuilder.delete(editor.selection);
    }).then( () => {
        editor.edit( (editBuilder) => {
            editBuilder.insert(editor.selection.start, item.label);
        });
    });
}

function replaceWithUnicode(editor: vscode.TextEditor) {
    if (!editor) { return; }

    // If nothing is selected, select everything
    let selection = (() => {
        if (editor.selection.start.isBefore(editor.selection.end)) {
            return editor.selection;
        } else {
            let endLine = editor.document.lineAt(editor.document.lineCount - 1);
            return new vscode.Selection(
                new vscode.Position(0, 0),
                new vscode.Position(endLine.lineNumber, endLine.text.length)
            );
        }
    })();

    let text = editor.document.getText(selection);
    let replacement = text.replace(RE_LATEX_NAME, (m: string) => {
        if (latexSymbols.hasOwnProperty(m)) {
            return latexSymbols[m];
        }
        return m;
    });

    editor.edit((editBuilder) => {
        editBuilder.replace(selection, replacement);
    });
}

function appendLatexOfUnicode(editor: vscode.TextEditor) {
    if (!editor) { return; }

    // If nothing is selected, do nothing
    let selection = (() => {
        if (editor.selection.start.isBefore(editor.selection.end)) {
            return editor.selection;
        } else {
            return;
        }
    })();

    let text = editor.document.getText(selection);
    if (latexSymbols2.hasOwnProperty(text)){
        editor.edit((editBuilder) => {
            editBuilder.insert(editor.selection.end, latexSymbols2[text]);
        });
    }
}
// this method is called when your extension is deactivated
export function deactivate() {}
