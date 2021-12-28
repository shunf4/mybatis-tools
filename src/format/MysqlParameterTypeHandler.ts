import { BaseParameterTypeHandler } from "./BaseParameterTypeHandler";

export class MysqlParameterTypeHandler extends BaseParameterTypeHandler {
  /**
   * @param value
   * @returns
   */
  protected formatDate(value: string) {
    return `'${value}'`;
  }
}
