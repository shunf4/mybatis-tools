import * as mysql from 'mysql';
import * as oracle from 'oracledb';
import { ColumnInfo, MysqlDataType, OracleDataType } from '../data/DataType';

interface DBConnector {
    /** 连接数据库并基于连接执行操作 */
    connect(fn: (conn: mysql.Connection | oracle.Connection, error: Error, ...args: any[]) => void): void;

    /** 表字段 */
    listColumn(tableName: string): Array<ColumnInfo> | Promise<Array<ColumnInfo>>;
}

export abstract class TcpDBConnector implements DBConnector {

    tag: string = '';
    host: string = "127.0.0.1";
    port: number = 8080;
    user: string = "root";
    password: string = "1234";
    database: string = "";

    connect(fn: (conn: mysql.Connection | oracle.Connection, error: Error, ...args: any[]) => void): void {
        throw new Error("Method not implemented.");
    }

    listColumn(tableName: string): Array<ColumnInfo> | Promise<Array<ColumnInfo>> {
        return [];
    }


}

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
                let sql = 'select c.TABLE_NAME, c.COLUMN_NAME, c.DATA_TYPE, c.DATA_LENGTH, c.DATA_PRECISION, c.DATA_SCALE, tc.COMMENTS, cc.COMMENTS'
                    + ' from USER_TAB_COLUMNS c'
                    + ' left join USER_TAB_COMMENTS tc on tc.TABLE_NAME = c.TABLE_NAME'
                    + ' left join USER_COL_COMMENTS cc on cc.TABLE_NAME = c.TABLE_NAME and cc.COLUMN_NAME = c.COLUMN_NAME'
                    + ' where c.table_name = ?'
                    + ' order by c.column_id';
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
                        let columnType = '';
                        // todo zx 完善各种数据类型的处理和分类
                        if (['VARCHAR2'].includes(dataType)) {
                            columnType = `${dataType}(${dataLength})`;
                        } else if (['NUMBER', 'DECIMAL'].includes(dataType)) {
                            columnType = `${dataType}(${dataPrecision},${dataScale})`;
                        } else {
                            columnType = dataType;
                        }
                        let columnInfo = new ColumnInfo(tableName, columnName, columnType, new OracleDataType());
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

/** mysql连接 */
export class MysqlConnector extends TcpDBConnector {

    connection !: mysql.Connection;

    connect(fn: (conn: mysql.Connection, error: mysql.MysqlError, ...args: any[]) => void): void {
        console.log('连接mysql信息', this.host, this.port, this.user, this.password, this.database);

        this.connection = mysql.createConnection({
            host: this.host,
            port: this.port,
            user: this.user,
            password: this.password,
            database: this.database
        });
        this.connection.connect((error, args) => {
            if (error) {
                console.log('数据库连接失败', error, args, this.connection);
            } else {
                console.log('数据库连接成功', this.connection);
            }
            fn(this.connection, error, args);
            this.connection.end();
        });

        if (this.connection.state === 'connected') {
            this.connection.end();
        }
    }

    async listColumn(tableName: string): Promise<Array<ColumnInfo>> {
        let columnInfos: ColumnInfo[] = [];
        return new Promise<Array<ColumnInfo>>((resolve, reject) => {
            this.connect(conn => {
                conn.query({
                    sql: 'SELECT c.TABLE_SCHEMA, c.TABLE_NAME, c.COLUMN_NAME, c.COLUMN_TYPE, t.TABLE_COMMENT, c.COLUMN_COMMENT'
                        + ' FROM information_schema.COLUMNS c'
                        + ' LEFT JOIN information_schema.tables t on t.TABLE_SCHEMA = c.TABLE_SCHEMA and t.table_name = c.TABLE_NAME'
                        + ' WHERE c.TABLE_SCHEMA=? AND c.TABLE_NAME=?'
                        + ' order by c.ordinal_position',
                    timeout: 40000,
                    values: [this.database, tableName]
                }, (error, results, fields) => {
                    console.log('mysql查询返回结果', results, fields);
                    for (let result of results) {
                        let columnType = result["COLUMN_TYPE"].split(' ')[0];
                        let columnName = result["COLUMN_NAME"];
                        let tableComment = result['TABLE_COMMENT'];
                        let columnComment = result['COLUMN_COMMENT'];
                        let columnInfo = new ColumnInfo(tableName, columnName, columnType, new MysqlDataType());
                        columnInfo.tableComment = tableComment;
                        columnInfo.columnComment = columnComment;
                        columnInfos.push(columnInfo);
                    }
                    resolve(columnInfos);
                });
            });
        });
    }
}
