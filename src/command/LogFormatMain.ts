import { BaseParameterTypeHandler, DatabaseType, getDataBaseTypes } from "./../format/BaseParameterTypeHandler";
import { Disposable } from "vscode";
import * as vscode from "vscode";
import { BaseCommand } from "./BaseCommand";
import { ParameterTypeHandleFactory } from "../format/ParameterTypeHandleFactory";

/**
 * 日志参数填充
 */
export class LogFormatMain extends BaseCommand implements Disposable {
  /** 动态sql前缀 */
  private dynamicSqlPrefix = "Preparing:";
  /** 参数前缀 */
  private parameterPrefix = "Parameters:";
  /** 动态sql前缀 */
  private dynamicSqlRegex = /(?<=Preparing:).*/g;
  /** 参数前缀 */
  private parameterRegex = /(?<=Parameters:).*/g;

  dispose(): any {
    let cmd = LogFormatMain.getCommand("log-format");
    return vscode.commands.registerCommand(cmd, () => {
      this.doCommand();
    });
  }

  async doCommand(): Promise<void> {
    // 从剪贴板获取sql日志
    let res = await this.getClipboardData();

    if (res) {
      let result = await this.logFormat(res);
      // 新建一个文件, 将转换后的文本写入
      let document = await vscode.workspace.openTextDocument({
        content: result.join(";\n\n"),
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
    let dbType = vscode.workspace.getConfiguration("mybatis-tools").get<DatabaseType>("databaseType");
    if (!dbType) {
      dbType = ((await vscode.window.showQuickPick(getDataBaseTypes())) as DatabaseType) || DatabaseType.MYSQL;
    }

    let handler = ParameterTypeHandleFactory.build(dbType);

    logStr = logStr.substring(logStr.indexOf(this.dynamicSqlPrefix));
    let dynamicSqls = logStr.match(this.dynamicSqlRegex) || [];
    let parameterArr = logStr.match(this.parameterRegex) || [];
    let dynamicSqlSymbolCount: Number[] = [];
    let parameterSymbolCount: Number[] = [];
    dynamicSqls.forEach((value, index) => {
      let count = (value.match(/\?/g) || []).length;
      dynamicSqlSymbolCount.push(count);
    });
    parameterArr.forEach((value, index) => {
      if (!value || value.trim() === "") {
        parameterSymbolCount.push(0);
      } else {
        let count = (value.match(/,/g) || []).length;
        parameterSymbolCount.push(count + 1);
      }
    });

    let sqls: string[] = [];
    for (let [index, dynamicSql] of dynamicSqls.entries()) {
      let symbolCount = dynamicSqlSymbolCount[index];
      if (dynamicSqlSymbolCount[index] <= 0) {
        sqls.push(dynamicSql);
        continue;
      }
      // 从当前索引匹配当前sql对应长度的参数
      let parameter = "";
      let parameterIndex = parameterSymbolCount.slice(index).indexOf(symbolCount);
      if (parameterIndex !== -1) {
        parameter = parameterArr[index + parameterIndex];
      }

      if (parameterIndex === -1) {
        // 向前查找
        parameterIndex = parameterSymbolCount.slice(0, index).reverse().indexOf(symbolCount);
        parameter = parameterArr[index - 1 - parameterIndex];
      }

      if (parameterIndex === -1) {
        sqls.push(dynamicSql);
        continue;
      } else {
        sqls.push(await this.formatSql(handler, dynamicSql, parameter));
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
    dynamicSql = dynamicSql.trim();
    parameter = parameter.trim();
    let params = parameter.split(",");

    for (let param of params) {
      // 修复参数为空字符串 无法获取类型
      let type = (/(?<=\s*\w*\()\w+(?=\))/.exec(param) || [""])[0];
      let value;
      if (type) {
        // 直接截取类型参数之前的字符
        value = param.substring(0, param.lastIndexOf(type) - 1);
      } else {
        value = param.trim();
      }
      let result = handler.formatParam(type, value);
      dynamicSql = dynamicSql.replace("?", result);
    }
    return dynamicSql;
  }
}
