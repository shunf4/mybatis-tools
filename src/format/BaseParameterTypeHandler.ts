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
