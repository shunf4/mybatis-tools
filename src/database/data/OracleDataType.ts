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
            { columnType: /NUMBER/, javaType: 'java.lang.Integer' },
            { columnType: /DECIMAL/, javaType: 'java.math.BigDecimal' },
            /** 时间 */
            { columnType: /DATE/, javaType: 'java.util.Date' },
            { columnType: /TIMESTAMP/, javaType: 'java.util.Date' },
            /** 字符串 */
            { columnType: /VARCHAR2/, javaType: 'java.lang.String' }
        );
    }

}
