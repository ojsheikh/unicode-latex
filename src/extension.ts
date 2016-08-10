'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {latexSymbols} from './latex';

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

    let disposable = vscode.commands.registerCommand('unicode-latex.insertMathSymbol', () => {
        vscode.window.showQuickPick(latexItems, pickOptions).then(insertSymbol);
    });

    context.subscriptions.push(disposable);
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

// this method is called when your extension is deactivated
export function deactivate() {}
