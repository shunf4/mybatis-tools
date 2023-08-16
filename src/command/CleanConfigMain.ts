import * as vscode from "vscode";
import {Disposable} from "vscode";
import {BaseCommand} from "./BaseCommand";
import {MapperMappingContext} from "../mapping/MapperMappingContext";

/**
 * clean context
 */
export class CleanConfigMain extends BaseCommand implements Disposable {
    dispose(): any {
        let cmd = CleanConfigMain.getCommand("clean");
        return vscode.commands.registerCommand(cmd, () => {
            this.doCommand();
        });
    }

    doCommand(): void {
        MapperMappingContext.clean();
        vscode.window.showInformationMessage("缓存清理完成!");
    }
}
