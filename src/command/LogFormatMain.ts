import { BaseParameterTypeHandler, DatabaseType, getDataBaseTypes } from "./../format/BaseParameterTypeHandler";
import { Disposable, InputBoxOptions } from "vscode";
import * as vscode from "vscode";
import { BaseCommand } from "./BaseCommand";
import { ParameterTypeHandleFactory } from "../format/BaseParameterTypeHandler";

export class LogFormatMain extends BaseCommand implements Disposable {
  /** 动态sql前缀 */
  private dynamicSqlPrefix = "Preparing:";
  /** 参数前缀 */
  private parameterPrefix = "Parameter:";
  /** 动态sql前缀 */
  private dynamicSqlRegex = /Preparing:(.*)/;
  /** 参数前缀 */
  private parameterRegex = /Parameter:(.*)/;

  dispose() {
    let cmd = LogFormatMain.getCommand("log-format");
    return vscode.commands.registerCommand(cmd, () => {
      this.doCommand();
    });
  }

  async doCommand() {
    // 获取当前工作空间的数据库类型
    // 右键获取选中的数据
    // 获取剪贴板数据
    this.getClipboardData();
  }

  /**
   * 获取剪贴板中数据
   */
  private getClipboardData() {
    vscode.env.clipboard.readText().then((res) => {
      if (res) {
        let result = this.logFormat(res);
        console.log("转换结果: ", result);
      } else {
        vscode.window.showErrorMessage("没有复制mybatis日志");
      }
    });
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
    }

    let handler = ParameterTypeHandleFactory.build(dbType);

    logStr = logStr.substring(logStr.indexOf("dynamicSqlPrefix"));

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
      let value = (/\w+(?=\s*\(\s*\w+\s*\))/.exec(param) || [""])[0];
      let type = (/(?<=\w+\s*\(\s*)\w+(?=\s*\)))/.exec(param) || [""])[0];
      let result = handler.formatParam(type, value);
      trimmedDynamicSql = trimmedDynamicSql.replace("?", result);
    }
    return trimmedDynamicSql;
  }
}
