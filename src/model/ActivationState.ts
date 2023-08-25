import { OutputChannel } from "vscode";

export type ActivationState = {
    oChan: OutputChannel;
    currMapperIndexRunInstance: string | undefined;
};
