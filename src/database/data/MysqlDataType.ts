import { DataType } from './DataType';

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
            { columnType: /VARCHAR/, javaType: 'java.lang.String' }
        );
    }

}
