import { FileGenerateOption } from "../../model/FileGenerateOption";

import * as vscode from 'vscode';
import { MysqlConnector } from "../connect/MysqlConnector";
import { OracleConnector } from "../connect/OracleConnector";
import { EntityFileGenerate } from "./EntityFileGenerate";
import { MapperFileGenerate } from "./MapperFileGenerate";
import { XmlFileGenerate } from "./XmlFileGenerate";

export class FileGenerateFactory {
    type: string;
    options: FileGenerateOption;

    constructor(type: string, options: FileGenerateOption) {
        this.type = type;
        this.options = options;
    }

    /**
     * 文件生成
     */
    async generate(): Promise<void> {
        // 1. 获取数据库配置
        let dbEnvs = vscode.workspace.getConfiguration("mybatis-tools.connections").get<Array<any>>(this.type) || [];
        let selectedEnv = {
            tag: '',
            host: '',
            port: -1,
            user: '',
            password: '',
            database: '',
            sid: ''
        };
        if (dbEnvs && dbEnvs.length > 0) {
            for (let env of dbEnvs) {
                if (env.tag === this.options.tag) {
                    selectedEnv = env;
                    break;
                }
            }
        }
        let connect = null;
        if (this.type === 'mysql') {
            connect = new MysqlConnector();
            connect.host = selectedEnv.host;
            connect.port = selectedEnv.port;
            connect.user = selectedEnv.user;
            connect.password = selectedEnv.password;
            connect.database = selectedEnv.database;
        } else if (this.type === 'oracle') {
            connect = new OracleConnector();
            connect.host = selectedEnv.host;
            connect.port = selectedEnv.port;
            connect.sid = selectedEnv.sid;
            connect.user = selectedEnv.user;
            connect.password = selectedEnv.password;
            connect.database = selectedEnv.database;
        } else {
            throw new Error('不支持的数据库类型');
        }
        // 2. 访问数据库查询表字段
        return connect.listColumn(this.options).then(columnInfos => {
            console.log('字段信息', columnInfos);
            if (!columnInfos || columnInfos.length === 0) {
                throw new Error("表字段不存在");
            }
            // 3. entity mapper xml 生成
            let entityMaker = new EntityFileGenerate(this.options, columnInfos);
            entityMaker.generate();
            let interfaceMaker = new MapperFileGenerate(this.options, columnInfos);
            interfaceMaker.generate();
            let xmlMaker = new XmlFileGenerate(this.options, columnInfos);
            xmlMaker.generate();
        });
    }

}
