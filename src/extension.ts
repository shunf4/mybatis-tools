import { GenerateFileMain } from './command/GenerateFileMain';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { ConfigMain } from "./command/ConfigMain";
import { JumperMain } from "./command/JumperMain";
import { LogFormatMain } from "./command/LogFormatMain";
import { CleanConfigMain } from './command/CleanConfigMain';
import { FileGenerateSerializer } from './serial/FileGenerateSerializer';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "mybatis-tools" is now active!');

  // 映射配置加载
  context.subscriptions.push(new ConfigMain().dispose());
  // 跳转
  context.subscriptions.push(new JumperMain().dispose());
  // 日志格式化
  context.subscriptions.push(new LogFormatMain().dispose());
  // 缓存清理
  context.subscriptions.push(new CleanConfigMain().dispose());
  // 配置加载
  context.subscriptions.push(new GenerateFileMain(context).dispose());

  vscode.window.registerWebviewPanelSerializer('mybatis-tools.wakeup', new FileGenerateSerializer(context));


  
}

// this method is called when your extension is deactivated
export function deactivate() { }
