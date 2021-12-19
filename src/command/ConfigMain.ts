import { Disposable, InputBoxOptions } from "vscode";
import * as vscode from "vscode";
import { BaseCommand } from "./BaseCommand";

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
    vscode.window
      .showInputBox({
        placeHolder: "where is the interface directory?"
      })
      .then(text => {
        console.info("用户输入: {}", text);
        // todo zx file scan
      });
  }
}
