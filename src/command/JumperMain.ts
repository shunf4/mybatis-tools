import { Disposable, InputBoxOptions } from "vscode";
import * as vscode from "vscode";

import { BaseCommand } from "./BaseCommand";
import { MapperMappingContext } from "../mapping/MapperMappingContext";

/**
 * 通过命令进行跳转
 */
export class JumperMain extends BaseCommand implements Disposable {
  dispose() {
    let cmd = JumperMain.getCommand("jump");
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
    vscode.workspace.
      
  }
}
