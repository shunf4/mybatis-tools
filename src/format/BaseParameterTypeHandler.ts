import { OracleParameterTypeHandler } from "./OracleParameterTypeHandler";
import { MysqlParameterTypeHandler } from "./MysqlParameterTypeHandler";
/* eslint-disable @typescript-eslint/naming-convention */
export enum ParameterType {
  INTEGER = "Integer",
  LONG = "Long",
  DOUBLE = "Double",
  FLOAT = "Float",
  DECIMAL = "Decimal",
  DATE = "Date",
  TIMESTAMP = "Timestamp",
  STRING = "String",
  NULL = "null",
}

export enum DatabaseType {
  MYSQL = "mysql",
  ORACLE = "oracle",
}

export function getDataBaseTypes(): string[] {
  let types: string[] = [];
  Object.keys(DatabaseType).forEach((key) => {
    types.push(key);
  });
  return types;
}

export class ParameterTypeHandleFactory {
  /**
   * 根据数据库类型获取参数解析对象
   * @param databaseType
   * @returns
   */
  static build(databaseType: DatabaseType): BaseParameterTypeHandler {
    let handler;
    switch (databaseType) {
      case DatabaseType.MYSQL:
        handler = new MysqlParameterTypeHandler();
        break;
      case DatabaseType.ORACLE:
        handler = new OracleParameterTypeHandler();
        break;
      default:
        handler = new MysqlParameterTypeHandler();
    }
    return handler;
  }
}

export abstract class BaseParameterTypeHandler {
  formatParam(type: string, value: string): string {
    if (type === ParameterType.INTEGER || type === ParameterType.LONG || type === ParameterType.DOUBLE || type === ParameterType.FLOAT || type === ParameterType.DECIMAL) {
      return this.formatNumber(value);
    }
    if (type === ParameterType.STRING) {
      return this.formatString(value);
    }
    if (type === ParameterType.DATE) {
      return this.formatDate(value);
    }
    if (type === ParameterType.TIMESTAMP) {
      return this.formatTimestamp(value);
    }
    return value;
  }

  formatNumber(value: string) {
    return value;
  }

  formatString(value: string) {
    return `"${value}"`;
  }

  formatDate(value: string) {
    return `"${value}"`;
  }

  formatTimestamp(value: string) {
    return `"${value}"`;
  }
}
