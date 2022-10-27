import * as vscode from "vscode";
import { Disposable, TextDocument } from 'vscode';


class FileSaveListener implements Disposable {
    dispose() {
        return vscode.workspace.onDidSaveTextDocument(doc => {
            console.log("文件保存", doc.fileName);

            const fileNames = doc.fileName.split("\.");

            switch (fileNames[fileNames.length - 1]) {
                case "xml":
                    this.mapperXmlSave(doc);
                    break;
                case "java":
                    this.mapperJavaSave(doc);
                    break;
                default:
                    break;
            }


        });
    }

    private mapperXmlSave(doc: TextDocument) {
        const fileNames = doc.fileName.split("\.");


    }

    private mapperJavaSave(doc: TextDocument) {
        // todo 
    }
}
