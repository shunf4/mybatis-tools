import {FileGenerateOption} from '../../model/FileGenerateOption';
import * as mysql from 'mysql';
import {ColumnInfo} from "../data/ColumnInfo";
import {MysqlDataType} from "../data/MysqlDataType";
import {TcpDBConnector} from './DBConnector';
import * as vscode from 'vscode';

/** mysql连接 */

export class MysqlConnector extends TcpDBConnector {

    connection!: mysql.Connection;

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

    async listColumn(options: FileGenerateOption): Promise<Array<ColumnInfo>> {
        let columnInfos: ColumnInfo[] = [];
        let tableName = options.tableName;
        return new Promise<Array<ColumnInfo>>((resolve) => {
            this.connect(conn => {
                conn.query({
                    sql: `SELECT c.TABLE_SCHEMA, c.TABLE_NAME, c.COLUMN_NAME, c.COLUMN_TYPE, t.TABLE_COMMENT, c.COLUMN_COMMENT, (case c.COLUMN_KEY when 'PRI' then '1' else '0' end) IS_ID
                        FROM information_schema.COLUMNS c
                        LEFT JOIN information_schema.tables t on t.TABLE_SCHEMA = c.TABLE_SCHEMA and t.table_name = c.TABLE_NAME
                        WHERE c.TABLE_SCHEMA=? AND c.TABLE_NAME=?
                        order by c.ordinal_position`,
                    timeout: 40000,
                    values: [this.database, tableName]
                }, (error, results, fields) => {
                    if (!results || results.length === 0) {
                        vscode.window.showErrorMessage(tableName + "字段不存在");
                        throw Error(tableName + "字段不存在");
                    }
                    console.log('mysql查询返回结果', results, fields);
                    for (let result of results) {
                        let columnType = result["COLUMN_TYPE"].split(' ')[0];
                        let columnName = result["COLUMN_NAME"];
                        let tableComment = result['TABLE_COMMENT'];
                        let columnComment = result['COLUMN_COMMENT'];
                        let isId = result['IS_ID'] === '1';
                        let columnInfo = new ColumnInfo(new MysqlDataType(), tableName, columnName, columnType, isId, options);
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
