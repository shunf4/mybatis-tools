import { BaseFileGenerate } from "./FileGenerate";
import { Elements } from "./ElementDefine";
import * as vscode from 'vscode';

export class EntityFileGenerate extends BaseFileGenerate {


    weaveContent(): void {
        let elements = new Elements(this.options, this.columnInfos);
        this.content = elements.weaveContent();
    }

    writeFile(): void {
        let projectPath = vscode.Uri.parse(this.options.projectPath);
        let fileDirectory = vscode.Uri.joinPath(projectPath,
            this.options.parentPackage.replace(/\./g, '/'),
            this.options.entityPath.replace(/\./g, '/')
        );
        let filePath = vscode.Uri.joinPath(projectPath,
            this.options.parentPackage.replace(/\./g, '/'),
            this.options.entityPath.replace(/\./g, '/'),
            this.columnInfos[0].className + '.java'
        );

        vscode.workspace.fs.createDirectory(fileDirectory).then(() => {
            vscode.workspace.fs.writeFile(filePath, Buffer.from(this.content));
        });
    }

}