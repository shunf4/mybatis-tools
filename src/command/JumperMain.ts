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
  doCommand() {
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
    let offset = document.offsetAt(curPos);
    let firstCharOffset = offset - line.firstNonWhitespaceCharacterIndex;

    let word = "";
    let pos = 0;
    for (let char of line.text) {
      pos++;
      if (!Constant.PATTERN_NAME.test(char)) {
        word = "";
        if (pos + firstCharOffset > offset) {
          break;
        }
        continue;
      }
      word += char;
    }

    let fileName = document.fileName;
    if (fileName.endsWith("java")) {
      // 如果当前为java文件
      let content = document.getText();
      let packageName = InterfaceDecode.package(content);
      let namespace = packageName + "." + fileName;
      console.log("获取文本信息: ", packageName, namespace, word);
    } else if (fileName?.endsWith("xml")) {
      // 如果当前文件为xml文件
    }
  }
}
