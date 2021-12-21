import { Disposable, InputBoxOptions } from "vscode";
import * as vscode from "vscode";
import { BaseCommand } from "./BaseCommand";
import { MapperMappingContext } from "../mapping/MapperMappingContext";

export class ConfigMain extends BaseCommand implements Disposable {
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
    // 1. 输入一个模糊的mapper xml路径
    // 2. 查找匹配该路径的xml文件
    // 3. 获取namespace
    // 4. 根据namespace, 获取接口文件的位置
    // 5. 将namespace作为键, 接口,xml路径作为值, 保存到上下文.
    vscode.window
      .showInputBox({
        placeHolder: "where is the interface directory?",
      })
      .then(async (text) => {
        vscode.window.showInformationMessage("正在加载mapper映射关系...");

        // basePath = src/main/java/com/cpic/partmanage/dataManage/mapper
        let basePath = text + "**/*.xml";
        let files = await vscode.workspace.findFiles(basePath);

        for (const file of files) {
          let isSuccess = await MapperMappingContext.registryMapperXmlFile(file);
        }
        MapperMappingContext.printMapperMappingMap();
        vscode.window.showInformationMessage("nice~ 映射关系加载完成!" + MapperMappingContext.summeryInfo());
      });
  }
}
