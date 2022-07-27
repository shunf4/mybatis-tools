import { DataType } from './DataType';

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
            { columnType: /NUMBER/i, javaType: 'java.lang.Integer' },
            { columnType: /DECIMAL/i, javaType: 'java.math.BigDecimal' },
            { columnType: /DECIMAL\(\d{1},0\)/i, javaType: 'java.lang.Integer' },
            { columnType: /DECIMAL\(\d{2,},0\)/i, javaType: 'java.lang.Long' },
            { columnType: /NUMBER\(\d{1},0\)/i, javaType: 'java.lang.Integer' },
            { columnType: /NUMBER\(\d{2,},0\)/i, javaType: 'java.lang.Long' },
            /** 时间 */
            { columnType: /DATE/i, javaType: 'java.util.Date' },
            { columnType: /TIMESTAMP/i, javaType: 'java.util.Date' },
            /** 字符串 */
            { columnType: /VARCHAR2/i, javaType: 'java.lang.String' },
            { columnType: /CHAR/i, javaType: 'java.lang.String' }
        );
    }

}
