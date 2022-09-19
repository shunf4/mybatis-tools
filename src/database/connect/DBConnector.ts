import {FileGenerateOption} from '../../model/FileGenerateOption';
import * as mysql from 'mysql';
import * as oracle from 'oracledb';
import {ColumnInfo} from "../data/ColumnInfo";

interface DBConnector {
    /** 连接数据库并基于连接执行操作 */
    connect(fn: (conn: mysql.Connection | oracle.Connection, error: Error, ...args: any[]) => void): void;

    /** 表字段 */
    listColumn(options: FileGenerateOption): Array<ColumnInfo> | Promise<Array<ColumnInfo>>;
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

    listColumn(options: FileGenerateOption): Array<ColumnInfo> | Promise<Array<ColumnInfo>> {
        return [];
    }


}


