import { Disposable, InputBoxOptions } from "vscode";
import * as vscode from "vscode";

import { BaseCommand } from "./BaseCommand";
import { MapperMappingContext } from "../mapping/MapperMappingContext";
import { Constant, InterfaceDecode } from "../util/JavaDecode";

/**
 * 通过命令进行跳转
 */
export class JumperMain extends BaseCommand implements Disposable {
  dispose() {
    let cmd = JumperMain.getCommand("jumper");
    return vscode.commands.registerCommand(cmd, () => {
      this.doCommand();
    });
  }
  async doCommand() {
    // 1. 获取光标所处的文件和方法名称
    // 2. 如果是接口:
    // 2.1 获取文件名称, 当前的package, 组装namespace
    // 2.2 根据namespace获取缓存中的xml位置, 如果没有重新加载, 还是没有提示是否创建statement
    // 3. 如果是xml
    // 3.1 获取当前所在位置的id, 获取当前文件的namespace
    // 3.2 根据namespace获取缓存中接口的位置, 如果没有重新加载, 还是没有提示创建接口.

    let activeEditor = vscode.window.activeTextEditor;
    if (activeEditor === undefined || !activeEditor) {
      return;
    }
    let document = activeEditor.document;
    let curPos = activeEditor.selection.active;
    let line = document.lineAt(curPos);

    let word = "";
    let pos = 0;
    for (let char of line.text.trimLeft()) {
      if (!Constant.PATTERN_CHAR.test(char)) {
        if (pos + line.firstNonWhitespaceCharacterIndex > curPos.character) {
          break;
        }
        pos++;
        word = "";
        continue;
      }
      pos++;
      word += char;
    }

    let filePath = document.fileName;
    let fileNameWithSuffix = filePath.substring(filePath.lastIndexOf("\\") + 1);
    let fileName = filePath.substring(filePath.lastIndexOf("\\") + 1, filePath.lastIndexOf("."));
    if (fileNameWithSuffix.endsWith("java")) {
      // 如果当前为java文件
      let content = document.getText();
      let packageName = InterfaceDecode.package(content);

      let namespace = packageName + "." + fileName;
      // 获取xml路径
      let mapperMapping = await MapperMappingContext.getMapperMappingByOtherFile(fileNameWithSuffix, namespace);
      console.log("获取文本信息: ", packageName, namespace, word, mapperMapping.xmlPath);
      // 匹配xml中该方法位置
      if (mapperMapping.xmlPath) {
        vscode.workspace.openTextDocument(mapperMapping.xmlPath).then(async (doc) => {
          let wordIndexAtLine = -1;
          let lineNumber = 0;
          for (; lineNumber < doc.lineCount; lineNumber++) {
            let lineText = doc.lineAt(lineNumber);
            wordIndexAtLine = lineText.text.indexOf(word);
            if (wordIndexAtLine !== -1) {
              break;
            }
          }

          let pos = new vscode.Position(lineNumber, wordIndexAtLine === -1 ? 0 : wordIndexAtLine);
          console.log("匹配xml中该方法位置", word, pos.line, pos.character);
          await vscode.window.showTextDocument(doc, 1, false).then((editor) => {
            editor.selection = new vscode.Selection(pos, pos);
          });
        });
      }
    } else if (fileNameWithSuffix.endsWith("xml")) {
      // 如果当前文件为xml文件
    }
  }
}
