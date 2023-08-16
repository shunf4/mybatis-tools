import * as vscode from "vscode";

/**
 *  向文件中新增的文本 记录其位置以及文本内容
 *
 */
export class AddContent {
    content: string;
    position: vscode.Position;

    constructor(content: string, position: vscode.Position) {
        this.content = content;
        this.position = position;
    }
}
