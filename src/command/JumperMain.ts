import { Disposable } from "vscode";
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

  /**
   * 执行命令
   * @returns
   */
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
    let word = this.findWordAroundCursor(activeEditor);

    let filePath = document.fileName;
    let fileNameWithSuffix = filePath.substring(filePath.lastIndexOf("\\") + 1);
    let fileName = filePath.substring(filePath.lastIndexOf("\\") + 1, filePath.lastIndexOf("."));

    if (fileNameWithSuffix.endsWith("java")) {
      // 如果当前为java文件
      let content = document.getText();
      let packageName = InterfaceDecode.package(content);

      let namespace = packageName + "." + fileName;
      // 获取xml路径
      let mapperMapping = await MapperMappingContext.getMapperMappingByJavaFile(fileNameWithSuffix, namespace);
      console.log("获取文本信息: ", packageName, namespace, word, mapperMapping.xmlPath);
      // 匹配xml中该方法位置
      if (mapperMapping.xmlPath) {
        this.jump(mapperMapping.xmlPath, word, this.doWhenNotMatchXml);
      } else {
        vscode.window.showWarningMessage("没有对应的java接口文件!");
      }
    } else if (fileNameWithSuffix.endsWith("xml")) {
      // 如果当前文件为xml文件
      let mapperMapping = await MapperMappingContext.registryMapperXmlFile(document.uri);
      if (mapperMapping && mapperMapping.javaPath) {
        this.jump(mapperMapping.javaPath, word, this.doWhenNotMatchJava);
      } else {
        vscode.window.showWarningMessage("没有对应的xml文件!");
      }
    }
  }

  /**
   * 查找光标所处位置的单词
   *
   * @param activeEditor 当前打开的文件
   * @returns
   */
  findWordAroundCursor(activeEditor: vscode.TextEditor): string {
    let document = activeEditor.document;
    let curPos = activeEditor.selection.active;
    let line = document.lineAt(curPos);
    // todo zx 判断光标不存在的情况
    // todo zx 临界值的判断 光标位于单词前 单词后

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
    return word;
  }

  /**
   * 跳转到指定文件 指定单词的位置
   * @param path
   * @param word
   * @param doWhenNotMatch
   */
  jump(path: vscode.Uri, word: string, doWhenNotMatch?: (document: vscode.TextDocument, word: string) => Promise<AddContent | null>) {
    vscode.workspace.openTextDocument(path).then(async (doc) => {
      let wordIndexAtLine = -1;
      let lineNumber = 0;
      for (; lineNumber < doc.lineCount; lineNumber++) {
        let lineText = doc.lineAt(lineNumber);
        wordIndexAtLine = lineText.text.indexOf(word);
        if (wordIndexAtLine !== -1) {
          break;
        }
      }

      // 没有匹配到文本
      if (wordIndexAtLine === -1 && doWhenNotMatch) {
        let addContent = await doWhenNotMatch(doc, word);
        vscode.window.showTextDocument(doc, 1, false).then((editor) => {
          vscode.window.activeTextEditor?.edit((edit) => {
            if (addContent) {
              edit.insert(addContent.position, addContent.content);
            }
          });
        });
      } else {
        let pos = new vscode.Position(lineNumber, wordIndexAtLine === -1 ? 0 : wordIndexAtLine);
        console.log("匹配文件中该方法位置", path.path, word, pos.line, pos.character);
        await vscode.window.showTextDocument(doc, 1, false).then((editor) => {
          editor.selection = new vscode.Selection(pos, pos);
        });
      }
    });
  }

  /**
   * 当在xml文件中没有匹配的statement时, 决定如何处理
   * @param doc
   * @param word
   */
  async doWhenNotMatchXml(doc: vscode.TextDocument, word: string): Promise<AddContent | null> {
    let res = await vscode.window.showQuickPick(["jump directly", "stay here", "create statement"], {
      canPickMany: false,
      title: "cannot find sql in xml, so next to do?",
    });
    if (!res || res === "stay here") {
      return null;
    }
    if (res === "jump directly") {
      let pos = new vscode.Position(0, 0);
      vscode.window.showTextDocument(doc, 1, false).then((editor) => {
        editor.selection = new vscode.Selection(pos, pos);
      });
      return null;
    }
    if (res === "create statement") {
      return this.createStatement(doc, word);
    }
    return null;
  }

  /**
   * 当java文件中没有匹配的method时, 决定如何处理
   * @param doc
   * @param word
   */
  async doWhenNotMatchJava(doc: vscode.TextDocument, word: string): Promise<AddContent | null> {
    let res = await vscode.window.showQuickPick(["jump directly", "stay here", "create abstract method"], {
      canPickMany: false,
      title: "cannot find method in interface, so next to do?",
    });

    if (!res || res === "stay here") {
      return null;
    }
    if (res === "jump directly") {
      let pos = new vscode.Position(0, 0);
      vscode.window.showTextDocument(doc, 1, false).then((editor) => {
        editor.selection = new vscode.Selection(pos, pos);
      });
      return null;
    }
    if (res === "create abstract method") {
      // todo zx cannot jump
      return this.createAbstractMethod(doc, word);
    }
    return null;
  }

  /**
   * 创建sql
   * @param doc
   * @param word
   */
  createStatement(doc: vscode.TextDocument, word: string): AddContent {
    // 从最后一行查找 出现</mapper>则为最后一行
    let index = doc.lineCount - 1;
    for (; index >= 0; index--) {
      // 如果行中出现 } 则认为是最后一行
      if (doc.lineAt(index).text.indexOf("</mapper>") !== -1) {
        break;
      }
    }
    let flag = word.startsWith("insert") ? "insert" : word.startsWith("update") ? "update" : word.startsWith("delete") ? "delete" : "select";
    let content = `    <${flag} id="${word}"}>
    -- todo add ur sql here!
    </${flag}>`;
    return new AddContent(content, new vscode.Position(index, 0));
  }

  /**
   * 创建抽象方法 返回字符串
   * @param doc
   * @param word
   */
  createAbstractMethod(doc: vscode.TextDocument, word: string): AddContent {
    let index = doc.lineCount - 1;
    for (; index >= 0; index--) {
      // 如果行中出现 } 则认为是最后一行
      if (doc.lineAt(index).text.indexOf("}") !== -1) {
        break;
      }
    }
    let prefix = "    // todo to finish this method!\n";
    let method = "";
    if (word.startsWith("insert") || word.startsWith("update") || word.startsWith("delete")) {
      method = `    int ${word}();`;
    } else {
      method = `    List<?> ${word}();`;
    }
    let textEditor = vscode.window.activeTextEditor;

    return new AddContent(prefix + method, new vscode.Position(index, 0));
  }
}

class AddContent {
  content: string;
  position: vscode.Position;

  constructor(content: string, position: vscode.Position) {
    this.content = content;
    this.position = position;
  }
}
