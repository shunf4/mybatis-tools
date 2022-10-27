import * as vscode from "vscode";
import { Disposable, Range } from "vscode";
import { BaseCommand } from "./BaseCommand";

/**
 * beautify sql
 */
export class SqlBeautifyMain extends BaseCommand implements Disposable {
    dispose(): any {
        let cmd = SqlBeautifyMain.getCommand("beautify");
        return vscode.commands.registerCommand(cmd, () => {
            this.doCommand();
        });
    }

    doCommand(): void {
        console.log("sql美化");
        // 获取当前窗口选中的文本 如果没有选中则获取所有
        let activeTextEditor = vscode.window.activeTextEditor;
        if (! activeTextEditor) {
            vscode.window.showErrorMessage("sql美化: 需要先打开或新建一个文档!");
            return;
        }
        let document = activeTextEditor.document;
        let rangeTextMap: Map<Range, string> = new Map<Range, string>();
        for (let selection of activeTextEditor.selections) {
            if (selection.start.isEqual(selection.end)) {
                // 没有选中区域, 则忽略
                continue;
            }
            let range = new Range(selection.start, selection.end);
            let text = document.getText(range);
            if (text.trim().length === 0) {
                // 选取区域的文本内容为空
                continue;
            }
            rangeTextMap.set(range, text);
        }
        if (rangeTextMap.size === 0) {
            // 没有选中区域则处理所有的文本内容
            let text = document.getText();
            let range = new Range(document.positionAt(0), document.positionAt(text.length));
            rangeTextMap.set(range, document.getText());
        }
        let sqlType = "mysql";
        

    }
}