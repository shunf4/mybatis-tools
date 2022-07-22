import * as vscode from 'vscode';
import { BaseCommand } from '../command/BaseCommand';
import { readExtentsionFile } from '../util/FileReader';

export class FileGenerateSerializer extends BaseCommand implements vscode.WebviewPanelSerializer {

    constructor(context: vscode.ExtensionContext) {
        super();
        this.context = context;
    }


    doCommand(): void {
        throw new Error('Method not implemented.');
    }


    async deserializeWebviewPanel(webviewPanel: vscode.WebviewPanel, state: any) {
        console.log(`Got state: ${state}`);
        webviewPanel.webview.html = readExtentsionFile(this.context, 'src/view/page/index.html');
    }

}