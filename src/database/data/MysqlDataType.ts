import {DataType} from './DataType';

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
            {columnType: /TINYINT/i, javaType: 'java.lang.Integer'},
            {columnType: /INT/i, javaType: 'java.lang.Integer'},
            {columnType: /BIGINT/i, javaType: 'java.lang.Long'},
            {columnType: /FLOAT/i, javaType: 'java.math.BigDecimal'},
            {columnType: /DOUBLE/i, javaType: 'java.math.BigDecimal'},
            {columnType: /DECIMAL/i, javaType: 'java.math.BigDecimal'},
            {columnType: /DECIMAL\(\d{1},0\)/i, javaType: 'java.lang.Integer'},
            {columnType: /DECIMAL\(\d{2,},0\)/i, javaType: 'java.lang.Long'},
            {columnType: /TINYINT\(1\)/i, javaType: 'java.lang.Boolean'},
            /** 时间 */
            {columnType: /DATETIME/i, javaType: 'java.util.Date'},
            {columnType: /TIMESTAMP/i, javaType: 'java.util.Date'},
            /** 字符串 */
            {columnType: /VARCHAR/i, javaType: 'java.lang.String'}
        );
    }

}
