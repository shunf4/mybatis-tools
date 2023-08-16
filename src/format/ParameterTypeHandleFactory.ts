import {OracleParameterTypeHandler} from "./OracleParameterTypeHandler";
import {MysqlParameterTypeHandler} from "./MysqlParameterTypeHandler";
import {BaseParameterTypeHandler, DatabaseType} from "./BaseParameterTypeHandler";

export class ParameterTypeHandleFactory {
    /**
     * 根据数据库类型获取参数解析对象
     * @param databaseType
     * @returns
     */
    static build(databaseType: string): BaseParameterTypeHandler {
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
