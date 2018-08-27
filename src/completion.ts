import * as vscode from 'vscode';

export class LatexCompletionItemProvider implements vscode.CompletionItemProvider {

    completionItems: vscode.CompletionItem[];

    public constructor(symbols: Object) {
        this.completionItems = Object.keys(symbols).map((key, index) => {
            let item = new vscode.CompletionItem(key, vscode.CompletionItemKind.Text);
            item.insertText = symbols[key];
            item.detail = symbols[key];
            return item;
        });
    }

    public provideCompletionItems(doc: vscode.TextDocument, pos: vscode.Position)
        : vscode.CompletionItem[]
    {
        const word = doc.getWordRangeAtPosition(pos, /\\[\^_]?[^\s\\]*/).with(undefined, pos);
        if (!word) {
            return [];
        }

        return this.completionItems.map((item) => {
            item.range = word;
            return item;
        });
    }
}
