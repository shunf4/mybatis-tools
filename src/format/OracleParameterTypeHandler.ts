import { BaseParameterTypeHandler } from "./BaseParameterTypeHandler";

export class OracleParameterTypeHandler extends BaseParameterTypeHandler {
  /**
   * @param value
   * @returns
   */
  protected formatDate(value: string) {
    return `'${value}'`;
  }
}
