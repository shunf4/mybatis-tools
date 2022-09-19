import {BaseParameterTypeHandler, DatabaseType} from "./BaseParameterTypeHandler";
import {DateFormat} from "./DateFormat";

export class OracleParameterTypeHandler extends BaseParameterTypeHandler {
    /**
     * @param value
     * @returns
     */
    protected formatDate(value: string): string {
        let format = DateFormat.match(value, DatabaseType.ORACLE);
        return `to_date('${value}', '${format}')`;
    }
}
