import { BaseParameterTypeHandler, DatabaseType, getDataBaseTypes } from "./../format/BaseParameterTypeHandler";
import { Disposable } from "vscode";
import * as vscode from "vscode";
import { BaseCommand } from "./BaseCommand";
import { ParameterTypeHandleFactory } from "../format/ParameterTypeHandleFactory";

export class LogFormatMain extends BaseCommand implements Disposable {
  /** 动态sql前缀 */
  private dynamicSqlPrefix = "Preparing:";
  /** 参数前缀 */
  private parameterPrefix = "Parameters:";
  /** 动态sql前缀 */
  private dynamicSqlRegex = /Preparing:.*/;
  /** 参数前缀 */
  private parameterRegex = /Parameters:.*/;

  dispose(): any {
    let cmd = LogFormatMain.getCommand("log-format");
    return vscode.commands.registerCommand(cmd, () => {
      this.doCommand();
    });
  }

  async doCommand() {
    // 从剪贴板获取sql日志
    let res = await this.getClipboardData();

    if (res) {
      let result = await this.logFormat(res);
      // 新建一个文件, 将转换后的文本写入
      let document = await vscode.workspace.openTextDocument({
        content: result.join("\n"),
        language: "sql",
      });
      vscode.window.showTextDocument(document, 1, false);
    } else {
      vscode.window.showErrorMessage("没有复制mybatis日志");
    }
  }

  /**
   * 获取剪贴板中数据
   */
  private async getClipboardData(): Promise<string> {
    return await vscode.env.clipboard.readText();
  }

  private getSelectedData() {}

  /**
   * 格式化字符串
   * @param logStr
   * @returns
   */
  private async logFormat(logStr: string): Promise<string[]> {
    // 获取数据库类型
    let dbType = vscode.workspace.getConfiguration("mybatis-tools").get<DatabaseType>("database");
    if (!dbType) {
      dbType = ((await vscode.window.showQuickPick(getDataBaseTypes())) as DatabaseType) || DatabaseType.MYSQL;
      // vscode.workspace.getConfiguration("mybatis-tools").update("database", dbType);
    }

    let handler = ParameterTypeHandleFactory.build(dbType);

    logStr = logStr.substring(logStr.indexOf(this.dynamicSqlPrefix));

    let dynamicSqls = logStr.match(this.dynamicSqlRegex) || [];
    let parameterArr = logStr.match(this.parameterRegex) || [];

    let dynamicSqlSymbolCount: Number[] = [];
    let parameterSymbolCount: Number[] = [];
    dynamicSqls.forEach((value, index) => {
      dynamicSqlSymbolCount.push((value.match(/\?/g) || []).length);
    });
    parameterArr.forEach((value, index) => {
      parameterSymbolCount.push((value.match(/,/g) || []).length + 1);
    });

    let sqls: string[] = [];
    for (let dynamicSql of dynamicSqls) {
      let dynamicSqlSymbolCount = (dynamicSql.match(/\?/g) || []).length;
      if (dynamicSqlSymbolCount > 0) {
        // 匹配当前sql对应长度的参数
        let parameter = parameterArr[parameterSymbolCount.indexOf(dynamicSqlSymbolCount)];
        sqls.push(await this.formatSql(handler, dynamicSql, parameter));
      } else {
        sqls.push(dynamicSql);
      }
    }
    return sqls;
  }

  /**
   * 格式化单个sql
   * @param handler 格式化处理器
   * @param dynamicSql 动态sql
   * @param parameter 参数
   * @returns
   */
  private async formatSql(handler: BaseParameterTypeHandler, dynamicSql: string, parameter: string): Promise<string> {
    // 去除动态sql以及参数字符串的前缀
    let trimmedDynamicSql = dynamicSql.substring(dynamicSql.indexOf(this.dynamicSqlPrefix) + this.dynamicSqlPrefix.length).trim();
    let trimmedParameter = parameter.substring(parameter.indexOf(this.parameterPrefix) + this.parameterPrefix.length).trim();

    let params = trimmedParameter.split(",");

    for (let param of params) {
      let type = (/(?<=\s*\w+\()\w+(?=\))/.exec(param) || [""])[0];
      let value;
      if (type) {
        // 开头非空格并且结尾为括号
        value = (/(?<=\s*)\S+.*(?=\(\w+\))/.exec(param) || param.trim())[0];
      } else {
        value = param.trim();
      }
      let result = handler.formatParam(type, value);
      trimmedDynamicSql = trimmedDynamicSql.replace("?", result);
    }
    return trimmedDynamicSql;
  }
}
