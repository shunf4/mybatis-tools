import { FileGenerateOption } from './../../model/FileGenerateOption';
import { underlineToHump } from '../../util/SysUtil';
import { DataType } from './DataType';
import { jdbcTypeMap } from './JdbcType';

/**
 * 字段信息 部分字段值冗余, 为了简化结构而已
 */

export class ColumnInfo {

    tableName: string;

    className: string;
    mapperName: string;
    tableComment: string = '';

    columnName: string;
    columnType: string;
    columnComment: string = '';
    isId: boolean = false;

    fieldType: string;
    simpleFieldType: string;
    fieldName: string;

    jdbcType: string = '';
    options: FileGenerateOption;


    constructor(dataType: DataType, tableName: string, columnName: string, columnType: string, isId: boolean, options: FileGenerateOption) {
        this.tableName = tableName;
        this.columnName = columnName;
        this.columnType = columnType;
        this.isId = isId;
        this.options = options;
        this.fieldName = this.getFieldName();
        this.className = this.getClassName();
        this.mapperName = this.getMapperName();
        this.fieldType = dataType.getMappedResult(this.columnType);
        let lastCommaIndex = this.fieldType.lastIndexOf(".");
        this.simpleFieldType = lastCommaIndex !== -1 ? this.fieldType.substring(lastCommaIndex + 1) : this.fieldType;
        this.jdbcType = this.getJdbcType(this.fieldType);
    }

    getFieldName(): string {
        return underlineToHump(this.columnName.toLowerCase());
    }

    getClassName(): string {
        let word = underlineToHump(this.tableName.toLowerCase()) + (this.options.classSuffix ? this.options.classSuffix : "EO");
        return word[0].toUpperCase() + word.substring(1);
    }

    getMapperName(): string {
        let word = underlineToHump(this.tableName.toLowerCase()) + "Mapper";
        return word[0].toUpperCase() + word.substring(1);
    }

    getJdbcType(fieldType: string): string {
        return jdbcTypeMap.get(fieldType) || '';
    }

}
