import { Disposable, InputBoxOptions } from "vscode";
import * as vscode from "vscode";
import { BaseCommand } from "./BaseCommand";
import { fstatSync } from "fs";
import { XMLBuilder, XMLParser } from "fast-xml-parser";

export class ConfigMain extends BaseCommand implements Disposable {

  private options = {
    attributeNamePrefix: "@_",
    attrNodeName: "attr", //default is 'false'
    textNodeName: "#text",
    ignoreAttributes: false,
    ignoreNameSpace: false,
    allowBooleanAttributes: true,
    parseNodeValue: true,
    parseAttributeValue: true,
    trimValues: true,
    cdataTagName: "__cdata", //default is 'false'
    cdataPositionChar: "\\c",
    parseTrueNumberOnly: false,
    numParseOptions: {
      hex: true,
      leadingZeros: true,
      //skipLike: /\+[0-9]{10}/
    },
    arrayMode: false, //"strict"
    // attrValueProcessor: (val: any, attrName: any) => he.decode(val, { isAttributeValue: true }), //default is a=>a
    // tagValueProcessor: (val: any , tagName) => he.decode(val), //default is a=>a
    // stopNodes: ["parse-me-as-string"],
    alwaysCreateTextNode: true,
  };

  constructor() {
    super();
  }

  dispose(): any {
    let cmd = ConfigMain.getCommand("config");
    return vscode.commands.registerCommand(cmd, () => {
      this.doCommand();
    });
  }

  doCommand() {
    vscode.window
      .showInputBox({
        placeHolder: "where is the interface directory?",
      })
      .then(async (text) => {
        console.info("用户输入: {}", text);
        // basePath = src/main/java/com/cpic/partmanage/dataManage/mapper
        let basePath = text + "**/*.xml";
        let files = await vscode.workspace.findFiles(basePath);

        const parser = new XMLParser(this.options);
        for (const file of files) {
          let readData = await vscode.workspace.fs.readFile(file);
          let content = Buffer.from(readData).toString("utf8");

          let mapperObject = parser.parse(content);
          // 不存在mapper节点
          if(mapperObject.mapper === undefined || !mapperObject.mapper) {
            continue;
          }
          console.log("转换结果: ", mapperObject);
        }

      });
  }
}
