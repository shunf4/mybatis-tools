import * as vscode from 'vscode';
import { stringToRegExp } from '../../util/RegExpUtil';

export class DataTypeMapping {

    columnType: RegExp;
    javaType: string;

    constructor(columnType: RegExp, javaType: string) {
        this.columnType = columnType;
        this.javaType = javaType;
    }
}

export abstract class DataType {
    mappings: Array<DataTypeMapping> = [];

    static javaTypes: string[] = [
        'java.lang.Boolean',
        'java.lang.Integer',
        'java.lang.Long',
        'java.math.BigDecimal',
        'java.util.Date',
        'java.lang.String'
    ];

    constructor() {
        this.init();
    }

    /** 初始化 */
    abstract init(): void;

    /** 获取所有的java类型支持 */
    loadJavaTypes(): string[] {
        return DataType.javaTypes;
    }

    /**
     * 加载映射
     */
    loadMappings(type: string) {
        // 如果存在本地映射 覆盖默认映射关系
        // 加载本地的类型映射配置, 加载的结果字段为字符串类型因此需要进行转化.
        let newMappings = vscode.workspace.getConfiguration('mybatis-tools.dataType').get<Array<any>>(type) || [];
        if (newMappings && newMappings.length > 0) {
            this.mappings = [];
            for (const newMapping of newMappings) {
                this.mappings.push({
                    columnType: stringToRegExp(newMapping["columnType"]),
                    javaType: newMapping["javaType"]
                });
            }
            console.log('加载类型映射关系', this.mappings);
        }
    }

    /**
     * 保存映射
     */
    saveMappings(type: string, data: [{ columnType: string, javaType: string }]): void {
        let newData = [];
        for (let d of data) {
            if (d.columnType === '' || d.javaType === '') {
                continue;
            }
            try {
                stringToRegExp(d.columnType);
            } catch (error) {
                console.log('正则表达式错误');
                throw Error("正则表达式错误 " + d.columnType);
            }
            newData.push(d);
        }
        vscode.workspace.getConfiguration('mybatis-tools.dataType').update(type, newData);
    }

    /**
     * 获取字段类型对应的java类型
     * @param realColumnType
     */
    getMappedResult(realColumnType: string): string {
        let lastLength: number = 0;
        let lastJavaType:string = '';
        for (let mapping of this.mappings) {
            if (!new RegExp(mapping.columnType).test(realColumnType)) {
                continue;
            }
            let len = mapping.columnType.toString().length;
            if (lastLength < len) {
                lastJavaType = mapping.javaType;
                lastLength = len;
            }
        }
        if (lastJavaType) {
            return lastJavaType;
        } else {
            throw new Error("不匹配的字段类型" + realColumnType);
        }
    }

}


