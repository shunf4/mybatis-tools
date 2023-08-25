import * as vscode from "vscode";
import { ActivationState } from "../model/ActivationState";

export abstract class BaseCommand {
    context: vscode.ExtensionContext;
    activationState: ActivationState;
    oChan: vscode.OutputChannel;
    public static pluginName = "mybatis-tools";

    constructor({context, activationState}: {context: vscode.ExtensionContext, activationState: ActivationState}) {
        this.context = context;
        this.activationState = activationState;
        this.oChan = activationState.oChan;
    }

    public static getCommand(shortName: string): string {
        return this.pluginName + "." + shortName;
    }

    abstract doCommand(): void;
}
