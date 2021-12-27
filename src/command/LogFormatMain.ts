import { DatabaseType } from "./../format/BaseParameterTypeHandler";
import { ParameterType } from "./../../.history/src/format/BaseParameterTypeHandler_20211227202207";
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
    // 获取剪贴板数据
    // 右键获取选中的数据
  }

  private getClipboardData() {
    vscode.env.clipboard.readText().then(res => {
      if (res) {
      } else {
        vscode.window.showErrorMessage("没有复制mybatis日志");
      }
    });
  }

  private getSelectedData() {}

  private logFormat(logStr: string): string {
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

    for (let dynamicSql of dynamicSqls) {
      let dynamicSqlSymbolCount = (dynamicSql.match(/\?/g) || []).length;
      if (dynamicSqlSymbolCount > 0) {
        let parameter =
          parameterArr[parameterSymbolCount.indexOf(dynamicSqlSymbolCount)];
      }
    }

    // 出现多对动态sql
    // 1,2,3
    // 2,3,4
    // 2,3

    return [];
  }

  private formatSql(dynamicSql: string, parameter: string) {
    let trimmedDynamicSql = dynamicSql
      .substring(
        dynamicSql.indexOf(this.dynamicSqlPrefix) + this.dynamicSqlPrefix.length
      )
      .trim();
    let trimmedParameter = parameter
      .substring(
        parameter.indexOf(this.parameterPrefix) + this.parameterPrefix.length
      )
      .trim();

    let params = parameter.split(",");

    let dbType =
      vscode.workspace
        .getConfiguration("mybatis-tools")
        .get<DatabaseType>("database") || DatabaseType.MYSQL;
    let handler = ParameterTypeHandleFactory.build(dbType);

    for (let param of params) {
      let value = (/\w+(?=\s*\(\s*\w+\s*\))/.exec(param) || [""])[0];
      let type = (/(?<=\w+\s*\(\s*)\w+(?=\s*\)))/.exec(param) || [""])[0];
      let result = handler.formatParam(type, value);
      trimmedDynamicSql = trimmedDynamicSql.replace("?", result);
    }
    return trimmedDynamicSql;
  }
}
