'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {latexSymbols} from './latex';

const RE_LATEX_NAME = /(\\\S+)/g;

let latexItems: vscode.QuickPickItem[] = [];
let pickOptions: vscode.QuickPickOptions = {
    matchOnDescription: true,
};

export function activate(context: vscode.ExtensionContext) {

    latexItems = [];
    for (let name in latexSymbols) {
        latexItems.push({
            description: name,
            label: latexSymbols[name],
        });
    }

    let insertion = vscode.commands.registerCommand('unicode-latex.insertMathSymbol', () => {
        vscode.window.showQuickPick(latexItems, pickOptions).then(insertSymbol);
    });
    let replacement = vscode.commands.registerCommand('unicode-latex.replaceLatexNames', () => {
        replaceWithUnicode(vscode.window.activeTextEditor);
    });

    context.subscriptions.push(insertion);
    context.subscriptions.push(replacement);
}

function insertSymbol(item: vscode.QuickPickItem) {
    if (!item) { return; }
    let editor = vscode.window.activeTextEditor;
    editor.edit( (editBuilder) => {
        editBuilder.delete(editor.selection);
    }).then( () => {
        editor.edit( (editBuilder) => {
            editBuilder.insert(editor.selection.start, item.label);
        });
    });
}

function replaceWithUnicode(editor: vscode.TextEditor) {

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

// this method is called when your extension is deactivated
export function deactivate() {}
