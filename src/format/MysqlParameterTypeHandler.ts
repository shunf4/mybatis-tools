import {
  BaseParameterTypeHandler,
  DatabaseType
} from "./BaseParameterTypeHandler";
import { DateFormat } from "./DateFormat";

export class MysqlParameterTypeHandler extends BaseParameterTypeHandler {
  /**
   * @param value
   * @returns
   */
  protected formatDate(value: string): string {
    let format = DateFormat.match(value, DatabaseType.MYSQL);
    return `date_format('${value}', '${format}')`;
  }
}
