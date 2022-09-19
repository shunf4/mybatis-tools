import * as vscode from "vscode";

export abstract class BaseCommand {
    context!: vscode.ExtensionContext;
    public static pluginName = "mybatis-tools";

    public static getCommand(shortName: string): string {
        return this.pluginName + "." + shortName;
    }

    abstract doCommand(): void;
}
