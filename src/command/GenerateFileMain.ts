import { MysqlConnector, OracleConnector, TcpDBConnector } from '../database/connect/DBConnector';
import * as vscode from "vscode";
import { Disposable } from "vscode";
import { BaseCommand } from "./BaseCommand";
import { FILE_GENERATE_VIEW } from "../view/page/FileGenerateView";
import { DataType, MysqlDataType, OracleDataType } from "../database/data/DataType";
import { FileGenerateOption } from '../model/FileGenerateOption';
import { FileGenerateFactory } from '../database/generate/GenerateFactory';

/**
 * 文件生成
 */
export class GenerateFileMain extends BaseCommand implements Disposable {

    constructor(context: vscode.ExtensionContext) {
        super();
        this.context = context;
    }

    dispose(): any {
        let cmd = GenerateFileMain.getCommand("generate-file");
        return vscode.commands.registerCommand(cmd, () => {
            this.doCommand();
        });
    }

    async doCommand(): Promise<void> {
        const panel = vscode.window.createWebviewPanel(
            '文件生成',
            '文件生成',
            vscode.ViewColumn.One,
            {
                // Enable scripts in the webview
                enableScripts: true
            }
        );
        panel.webview.html = FILE_GENERATE_VIEW;

        // let filePath = vscode.Uri.joinPath(vscode.Uri.parse(this.context.extensionPath), 'src', 'view', 'page', 'index.html');
        // let readData = await vscode.workspace.fs.readFile(filePath);
        // let htmlContent = Buffer.from(readData).toString("utf8");
        // panel.webview.html = htmlContent;

        // 数据传递 command type data
        panel.webview.onDidReceiveMessage(
            msg => {
                if (!['openConfigFile'].includes(msg.command)) {
                    if (msg.type !== 'oracle' && msg.type !== 'mysql') {
                        vscode.window.showErrorMessage("不支持的数据库类型");
                        return;
                    }
                }
                switch (msg.command) {
                    case 'dbSave':
                        vscode.window.showErrorMessage(msg.text);
                        this.dbSave(msg.data, msg.type);
                        return;
                    case 'dbConnectTest':
                        this.dbConnectTest(msg.data, msg.type);
                        return;
                    case 'dbList':
                        let connections = vscode.workspace.getConfiguration("mybatis-tools.connections").get(msg.type);
                        panel.webview.postMessage({
                            command: 'dbListResult',
                            data: connections
                        });
                        return;
                    case 'dataType':
                        panel.webview.postMessage({
                            command: 'dataTypeResult',
                            data: this.dataTypeMappings(msg.type)
                        });
                        return;
                    case 'saveDataType':
                        this.saveDataType(msg.type, msg.data);
                        break;
                    case 'openConfigFile':
                        vscode.commands.executeCommand('workbench.action.openWorkspaceSettingsFile');
                        break;
                    case 'generateFile':
                        this.generateFile(msg.type, msg.data);
                        break;
                    case 'listDbEnv':
                        let dbEnvs = vscode.workspace.getConfiguration("mybatis-tools.connections").get<Array<any>>(msg.type) || [];
                        panel.webview.postMessage({
                            command: 'listDbEnvResult',
                            data: dbEnvs
                        });
                        break;
                    default:
                        return;
                }
            },
            undefined,
        );

    }

    /**
     * 数据库连接测试
     * @param data 数据库连接配置
     * @param type 数据库类型
     * @returns
     */
    dbConnectTest(data: any, type: string): void {
        if (type === 'oracle') {
            let oracleConnector = new OracleConnector();
            oracleConnector.host = data.host;
            oracleConnector.port = data.port;
            oracleConnector.sid = data.sid;
            oracleConnector.user = data.user;
            oracleConnector.password = data.password;
            oracleConnector.database = data.database;
            oracleConnector.connect((conn, error) => {
                console.log(error);
                if (error) {
                    vscode.window.showErrorMessage("connect failed! " + error.message);
                } else {
                    vscode.window.showInformationMessage("connect successed!");
                }
            });
        } else if (type === 'mysql') {
            let mysqlConnector = new MysqlConnector();
            mysqlConnector.host = data.host;
            mysqlConnector.port = data.port;
            mysqlConnector.user = data.user;
            mysqlConnector.password = data.password;
            mysqlConnector.database = data.database;
            mysqlConnector.connect(conn => {
                if (conn.state === 'connected') {
                    vscode.window.showInformationMessage("connect successed!");
                } else {
                    vscode.window.showErrorMessage("connect failed! current status: " + conn.state);
                }
            });
        } else {
            vscode.window.showErrorMessage("不支持的数据库类型");
            return;
        }

    }

    /**
     * 保存配置信息 根据tag作为key进行更新和新增
     * @param data
     * @param type
     * @returns
     */
    dbSave(data: any, type: string): void {
        if (!data.tag) {
            vscode.window.showErrorMessage("请输入TAG");
            return;
        }
        let connections = vscode.workspace.getConfiguration("mybatis-tools.connections").get<Array<TcpDBConnector>>(type);
        let connectionCopy = [];
        if (connections) {
            let hasConfig = false;
            for (const connection of connections) {
                if (connection.tag === data.tag) {
                    hasConfig = true;
                    connectionCopy.push(data);
                } else {
                    connectionCopy.push(connection);
                }
            }
            if (!hasConfig) {
                connectionCopy.push(data);
            }
        }
        vscode.workspace.getConfiguration("mybatis-tools.connections").update(type, connectionCopy);

    }

    /**
     * 获取所有的数据类型映射
     */
    dataTypeMappings(type: string): Array<any> {
        let dataType: DataType;
        if (type === 'mysql') {
            dataType = new MysqlDataType();
        } else if (type === 'oracle') {
            dataType = new OracleDataType();
        } else {
            throw new Error("不支持的数据类型");
        }
        let result = [];
        for (let mapping of dataType.mappings) {
            let data = { columnType: '', javaType: '' };
            data.columnType = mapping.columnType.toString();
            data.javaType = mapping.javaType;
            result.push(data);
        }
        return result;
    }

    saveDataType(type: string, data: [{ columnType: string, javaType: string }]) {
        let dataType: DataType;
        if (type === 'mysql') {
            dataType = new MysqlDataType();
        } else if (type === 'oracle') {
            dataType = new OracleDataType();
        } else {
            throw new Error("不支持的数据类型");
        }
        dataType.saveMappings(type, data);
    }

    generateFile(type: string, data: FileGenerateOption) {
        console.log('文件生成', data);
        if (!data.tag) {
            vscode.window.showInformationMessage('请选择数据库配置');
            return;
        }
        if (!data.tableName || data.tableName.length === 0) {
            vscode.window.showInformationMessage('请输入表名');
            return;
        }

        let fileGeneratefactory = new FileGenerateFactory(type, data);
        fileGeneratefactory.generate().then(() => {
            vscode.window.showInformationMessage('文件生成成功');
        }).catch(error => {
            console.log("文件生成失败", error);
            vscode.window.showInformationMessage('文件生成失败');
        });
    }
}
