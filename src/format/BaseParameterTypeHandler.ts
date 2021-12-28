/* eslint-disable @typescript-eslint/naming-convention */

/**
 * mybatis中使用的参数类型
 */
export enum ParameterType {
  INTEGER = "Integer",
  LONG = "Long",
  DOUBLE = "Double",
  FLOAT = "Float",
  DECIMAL = "Decimal",
  DATE = "Date",
  TIMESTAMP = "Timestamp",
  STRING = "String",
  // 日志中空的格式为 null, 没有指定类型
  NULL = "null",
}

/**
 * 数据库类型 目前支持mysql oracle
 */
export enum DatabaseType {
  MYSQL = "mysql",
  ORACLE = "oracle",
}

/**
 * 获取数据库类型枚举值数组 用于前端进行选择
 * @returns
 */
export function getDataBaseTypes(): string[] {
  let types: string[] = [];
  Object.values(DatabaseType).forEach((value) => {
    types.push(value);
  });
  return types;
}

/**
 * <p>基类 类型处理器, 将参数值转换为sql中该参数的样式
 */
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

  // ~ ------------------------------------------------------------
  // 以下方法需要在子类中根据不同数据库格式进行实现
  // ~ ------------------------------------------------------------

  protected formatNumber(value: string) {
    return value;
  }

  protected formatString(value: string) {
    return `'${value}'`;
  }

  /**
   * u'd better overwrite this method at subclasses
   * @param value
   * @returns
   */
  protected formatDate(value: string) {
    return `'${value}'`;
  }

  /**
   * u'd better overwrite this method at subclasses
   * @param value
   * @returns
   */
  protected formatTimestamp(value: string) {
    return this.formatDate(value);
  }
}
