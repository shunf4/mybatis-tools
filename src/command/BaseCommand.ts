import * as vscode from "vscode";

export abstract class BaseCommand {
    context: vscode.ExtensionContext;
    oChan: vscode.OutputChannel;
    public static pluginName = "mybatis-tools";

    constructor({context, oChan}: {context: vscode.ExtensionContext, oChan: vscode.OutputChannel}) {
        this.context = context;
        this.oChan = oChan;
    }

    public static getCommand(shortName: string): string {
        return this.pluginName + "." + shortName;
    }

    abstract doCommand(): void;
}
