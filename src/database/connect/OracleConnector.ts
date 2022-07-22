import * as oracle from 'oracledb';
import { ColumnInfo } from "../data/ColumnInfo";
import { OracleDataType } from "../data/OracleDataType";
import { TcpDBConnector } from './DBConnector';

/** oracle连接 */

export class OracleConnector extends TcpDBConnector {

    sid: string = "";

    connect(fn: (conn: oracle.Connection, error: oracle.DBError, ...args: any[]) => void): void {
        console.log('连接oracle信息', this.host, this.port, this.user, this.password, this.sid, this.database);
        oracle.getConnection(
            {
                user: this.user,
                password: this.password,
                connectString: `${this.host}:${this.port}/${this.sid}`
            },
            (error, connection) => {
                if (error) {
                    console.log('数据库连接失败', error);
                } else {
                    console.log('数据库连接成功');
                }
                fn(connection, error);
            }
        );
    }


    async listColumn(tableName: string): Promise<Array<ColumnInfo>> {
        return new Promise((resolve, rejects) => {
            this.connect(conn => {
                let sql = `select c.TABLE_NAME, c.COLUMN_NAME, c.DATA_TYPE, c.DATA_LENGTH,
                            c.DATA_PRECISION, c.DATA_SCALE, tc.COMMENTS, cc.COMMENTS, decode(pc.COLUMN_NAME, null, 0, 1) IS_ID
                        from USER_TAB_COLUMNS c
                        left join USER_TAB_COMMENTS tc on tc.TABLE_NAME = c.TABLE_NAME
                        left join USER_COL_COMMENTS cc on cc.TABLE_NAME = c.TABLE_NAME and cc.COLUMN_NAME = c.COLUMN_NAME
                        left join USER_CONS_COLUMNS pc on pc.TABLE_NAME = c.TABLE_NAME and pc.COLUMN_NAME = cc.COLUMN_NAME
                                                            and pc.CONSTRAINT_NAME = (select  uc.CONSTRAINT_NAME from user_constraints uc
                                                            where uc.TABLE_NAME = c.TABLE_NAME and pc.CONSTRAINT_NAME = uc.CONSTRAINT_NAME
                                                                and uc.CONSTRAINT_TYPE = 'P' and uc.STATUS = 'ENABLED')
                        where c.table_name = upper(?)
                        order by c.column_id`;
                conn.execute<any>(sql, [tableName], (error, result) => {
                    console.log('oralce 查询返回结果', result.rows);
                    let columnInfos: ColumnInfo[] = [];
                    for (const row of result.rows || []) {
                        let columnName = String(row[1]);
                        let dataType = String(row[2]);
                        let dataLength = Number(row[3]);
                        let dataPrecision = Number(row[4]);
                        let dataScale = Number(row[5]);
                        let tableComment = String(row[6]);
                        let columnComment = String(row[7]);
                        let isId = String(row[8]) === '1';
                        let columnType = '';
                        // todo zx 完善各种数据类型的处理和分类
                        if (['VARCHAR2'].includes(dataType)) {
                            columnType = `${dataType}(${dataLength})`;
                        } else if (['NUMBER', 'DECIMAL'].includes(dataType)) {
                            columnType = `${dataType}(${dataPrecision},${dataScale})`;
                        } else {
                            columnType = dataType;
                        }
                        let columnInfo = new ColumnInfo(tableName, columnName, columnType, new OracleDataType(), isId);
                        columnInfo.columnComment = columnComment;
                        columnInfo.tableComment = tableComment;
                        columnInfos.push(columnInfo);
                        resolve(columnInfos);
                    }
                });
            });
        });
    }

}
