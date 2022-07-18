import * as vscode from 'vscode';
import { stringToRegExp } from '../../util/RegExpUtil';
import { underlineToHump } from '../../util/SysUtil';

export class DataTypeMapping {

    columnType: RegExp;
    javaType: string;

    constructor(columnType: RegExp, javaType: string) {
        this.columnType = columnType;
        this.javaType = javaType;
    }
}

export class ColumnInfo {

    tableName: string;
    className: string;
    columnName: string;
    columnType: string;
    simpleFieldType: string;
    fieldName: string;
    fieldType: string;

    columnComment: string = '';
    tableComment: string = '';

    constructor(tableName: string, columnName: string, columnType: string, dataType: DataType) {
        this.tableName = tableName;
        this.columnName = columnName;
        this.columnType = columnType;
        this.fieldName = this.getFieldName();
        this.className = this.getClassName();
        this.fieldType = dataType.getMappedResult(this.columnType);
        let lastCommaIndex = this.fieldType.lastIndexOf(".");
        this.simpleFieldType = lastCommaIndex !== -1 ? this.fieldType.substring(lastCommaIndex + 1) : this.fieldType;
    }

    getFieldName(): string {
        return underlineToHump(this.columnName.toLowerCase());
    }

    getClassName(): string {
        let word = underlineToHump(this.tableName.toLowerCase()) + "EO";
        return word[0].toUpperCase() + word.substring(1);
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
            newData.push(d);
        }
        vscode.workspace.getConfiguration('mybatis-tools.dataType').update(type, newData);
    }

    /**
     * 获取字段类型对应的java类型
     * @param realColumnType
     */
    getMappedResult(realColumnType: string): string {
        for (let mapping of this.mappings) {
            console.log(mapping.columnType, typeof mapping.columnType, realColumnType);
            if (!new RegExp(mapping.columnType).test(realColumnType)) {
                continue;
            }
            return mapping.javaType;
        }
        throw new Error("不匹配的字段类型" + realColumnType);
    }

}

/**
 * mysql数据类型映射
 */
export class MysqlDataType extends DataType {

    constructor() {
        super();
        this.loadMappings('mysql');
    }

    init(): void {
        this.mappings = [];
        this.mappings.push(
            /** 数值 */
            { columnType: /TINYINT/, javaType: 'java.lang.Boolean' },
            { columnType: /INT/, javaType: 'java.lang.Integer' },
            { columnType: /BIGINT/, javaType: 'java.lang.Long' },
            { columnType: /FLOAT/, javaType: 'java.math.BigDecimal' },
            { columnType: /DOUBLE/, javaType: 'java.math.BigDecimal' },
            { columnType: /DECIMAL/, javaType: 'java.math.BigDecimal' },
            /** 时间 */
            { columnType: /DATETIME/, javaType: 'java.util.Date' },
            { columnType: /TIMESTAMP/, javaType: 'java.util.Date' },
            /** 字符串 */
            { columnType: /VARCHAR/, javaType: 'java.lang.String' },
        );
    }

}

/**
 * oracle数据类型映射
 */
export class OracleDataType extends DataType {

    constructor() {
        super();
        this.loadMappings('oracle');
    }

    init(): void {
        this.mappings = [];
        this.mappings.push(
            /** 数值 */
            { columnType: /NUMBER/, javaType: 'java.lang.Integer' },
            { columnType: /DECIMAL/, javaType: 'java.math.BigDecimal' },
            /** 时间 */
            { columnType: /DATE/, javaType: 'java.util.Date' },
            { columnType: /TIMESTAMP/, javaType: 'java.util.Date' },
            /** 字符串 */
            { columnType: /VARCHAR2/, javaType: 'java.lang.String' },
        );
    }

}
