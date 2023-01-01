# Unicode Latex for vscode

A visual studio code extension that allows the insertion of unicode symbols from the latex names of those symbols. The list of symbols is currently generated from the Julia programming language's REPL's latex completions.

## Usage

When editing a plaintext file, this extension provides autocompletions for latex symbols - inserting the equivalent unicode character for the selected completion. Completions are triggered on '\\'.

To insert a symbol, simply execute the `Unicode: Insert Math Symbol` command and type in the name of your desired symbol or select it from the drop-down list.

![Insertion Demo](https://raw.githubusercontent.com/oijazsh/unicode-latex/master/demo-insert.gif)

Similarly, to replace all LaTeX symbol names in a group of text, use the command `Unicode: Replace LaTeX`. If no text is highlighted, this command will act on the whole document. Otherwise, it will act on the selected text.

![Replacement Demo](https://raw.githubusercontent.com/oijazsh/unicode-latex/master/demo-replace.gif)

## Configuration

By default, this extension is only active in plaintext, markdown and coq files. You may add additional languages to support in `unicode-latex.extensions`. See https://code.visualstudio.com/docs/languages/identifiers#_known-language-identifiers for valid values.
