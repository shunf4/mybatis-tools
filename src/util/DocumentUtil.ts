import { AddContent } from "../model/AddContent";
import * as vscode from "vscode";

export class DocumentUtil {
  /**
   * 创建sql
   * @param doc
   * @param word
   */
  static createStatement(doc: vscode.TextDocument, word: string): AddContent {
    // 从最后一行查找 出现</mapper>则为最后一行
    let index = doc.lineCount - 1;
    for (; index >= 0; index--) {
      // 如果行中出现 } 则认为是最后一行
      if (doc.lineAt(index).text.indexOf("</mapper>") !== -1) {
        break;
      }
    }
    let flag = word.startsWith("insert")
      ? "insert"
      : word.startsWith("update")
      ? "update"
      : word.startsWith("delete")
      ? "delete"
      : "select";
    let content = `\n    <${flag} id="${word}">
    -- todo add ur sql here!
    </${flag}>\n`;
    return new AddContent(content, new vscode.Position(index, 0));
  }

  /**
   * 创建抽象方法 返回字符串
   * @param doc
   * @param word
   */
  static createAbstractMethod(
    doc: vscode.TextDocument,
    word: string
  ): AddContent {
    let index = doc.lineCount - 1;
    for (; index >= 0; index--) {
      // 如果行中出现 } 则认为是最后一行
      if (doc.lineAt(index).text.indexOf("}") !== -1) {
        break;
      }
    }
    let prefix = "    // todo to finish this method!\n";
    let method = "";
    if (
      word.startsWith("insert") ||
      word.startsWith("update") ||
      word.startsWith("delete")
    ) {
      method = `    int ${word}();\n`;
    } else {
      method = `    List<?> ${word}();\n`;
    }
    let textEditor = vscode.window.activeTextEditor;

    return new AddContent(prefix + method, new vscode.Position(index, 0));
  }
}
