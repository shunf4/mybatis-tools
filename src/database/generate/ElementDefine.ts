import { FileGenerateOption } from "../../model/FileGenerateOption";
import { ColumnInfo } from "../data/DataType";


const javaClass: string = `
package _package

_imports

_classComment
_@Data
_@SwaggerModel
_@tableName
public class _className {

_fields

_methods

}
`;

const classComment: string = `
/**
 * _tableComment
 *
 * @author _author
 */`;

interface ElementRule {
    (options: FileGenerateOption, columnInfo: ColumnInfo, columnInfos: ColumnInfo[]): boolean;
}

interface ElementApply {
    (options: FileGenerateOption, columnInfo: ColumnInfo, columnInfos?: ColumnInfo[]): void;
}

interface ElementValues {
    (options: FileGenerateOption, columnInfo: ColumnInfo, columnInfos?: ColumnInfo[]): string[];
}


class Element {
    content: string;
    /** 动态替换内容标记 */
    dynamics: string[];
    /** 如果必须使用该元素则不用设置规则,
     * 配合FileGenerateOption进行过元素是否添加判断,
     * 当然如果满足条件提前操作DynamicElements也是可以的 */
    rule: ElementRule = () => true;
    /**
     * 生成参数
     */
    apply: ElementApply = () => {
        return [];
    };
    values: ElementValues = () => {
        return [];
    };


    constructor(content: string, dynamics: string[], values?: ElementValues, rule?: ElementRule, apply?: ElementApply) {
        this.content = content;
        this.dynamics = dynamics;

        if (values) {
            this.values = values;
        }
        // 默认规则满足, 默认不执行规则条件下的操作
        if (rule) {
            this.rule = rule;
        }
        if (apply) {
            this.apply = apply;
        }
    }

    /**
     * 处理内容
     * @param values 需要替换的参数
     * @param options 生成策略
     * @param columnInfo 当前操作的字段
     * @param columnInfos 所有的表字段及类字段信息
     */
    handleContent(options: FileGenerateOption, columnInfo: ColumnInfo, columnInfos?: ColumnInfo[]): string {
        if (!this.rule(options, columnInfo, columnInfos || [])) {
            return '';
        }
        // 如果符合规则, 则执行定义操作
        this.apply(options, columnInfo, columnInfos || []);
        let values = this.values(options, columnInfo, columnInfos);
        if (!values) {
            return '';
        }
        // 文本内容的替换
        let resultContent = '';
        let contentCopy = this.content;
        if (this.dynamics && this.dynamics.length > 0) {
            for (let index in this.dynamics) {
                contentCopy = contentCopy.replace(this.dynamics[index], values[index]);
            }
        }
        resultContent = contentCopy;
        return resultContent;
    }
}

/**
 * 有些元素的出现是动态的, 随着规则配置变化而变化
 */
class DynamicElements {
    imports: string[] = [];
    fields: string[] = [];
    methods: string[] = [];
    classAnnotations: string[] = [];
}

/**
 * 固定元素, 将动态元素也固定化
 */
export class Elements {

    /** 根据顺序创建元素 */
    elements: Map<string, Element> = new Map<string, Element>();
    dynamicElements: DynamicElements = new DynamicElements();
    options: FileGenerateOption;
    columnInfos: ColumnInfo[];

    constructor(options: FileGenerateOption, columnInfos: ColumnInfo[]) {
        this.options = options;
        this.columnInfos = columnInfos;
        this.init();
    }

    init() {
        // ~ ------------------------------------------------------------------------------------------
        // 添加package
        this.elements.set("package", new Element("package _packagePath;\n", ["_packagePath"],
            options => [`${options.parentPackage}.${options.entityPath}`]));

        this.elements.set("classComment", new Element(classComment, ['_tableComment', '_author'],
            (options, columnInfo) => [columnInfo.tableComment, options.author],
            () => true));

        // ~ ------------------------------------------------------------------------------------------
        // 添加lombok
        this.elements.set("lombok.Data", new Element("@Data", [],
            () => [],
            options => options.isUseLombok,
            () => this.dynamicElements.imports.push("import lombok.Data;\n")));

        // ~ ------------------------------------------------------------------------------------------
        // 类的swagger注释
        this.elements.set("swagger.model", new Element("@ApiModel(\"_description\")", ["_description"],
            (_, columnInfo) => [columnInfo.tableComment],
            options => options.isSwagger,
            () => this.dynamicElements.imports.push("import io.swagger.annotations.ApiModel;\n")));

        // ~ ------------------------------------------------------------------------------------------
        // 添加mybatis-plus
        this.elements.set("tableName", new Element("@TableName(\"_tableName\")", ["_tableName"],
            options => [options.tableName],
            () => true,
            () => this.dynamicElements.imports.push("import com.baomidou.mybatisplus.annotations.TableName;\n")));

        // ~ ------------------------------------------------------------------------------------------
        // 添加字段
        this.elements.set("fields", new Element("", [], () => [],
            () => true, (options, ci, columnInfos) => {
                let prefix = "    ";

                let commentElement = new Element(prefix + "/** _comment */\n", ["_comment"],
                    (_, columnInfo) => [columnInfo.columnComment],
                    () => !options.isSwagger);
                let swaggerElement = new Element(prefix + "@ApiModelProperty(\"_comment\")\n", ["_comment"],
                    (_, columnInfo) => [columnInfo.columnComment],
                    () => options.isSwagger,
                    () => this.dynamicElements.imports.push("import io.swagger.annotations.ApiModelProperty;\n"));

                let dateFormatElement = new Element(prefix + "@DateTimeFormat(pattern = \"yyyy-MM-dd HH:mm:ss\")\n", [],
                    () => [],
                    (_, columnInfo) => ["Date", "LocalDateTime"].includes(columnInfo.simpleFieldType),
                    () => this.dynamicElements.imports.push("import org.springframework.format.annotation.DateTimeFormat;\n"));

                let jsonFormatElement = new Element(prefix + "@JsonFormat(pattern = \"yyyy-MM-dd HH:mm:ss\", timezone = \"GMT+8\")\n", [],
                    () => [],
                    (_, columnInfo) => ["Date", "LocalDateTime"].includes(columnInfo.simpleFieldType),
                    () => this.dynamicElements.imports.push("import com.fasterxml.jackson.annotation.JsonFormat;\n"));

                let mybatisPlusElement = new Element(prefix + "@TableField(\"_columnName\")\n", ["_columnName"],
                    (_, columnInfo) => [columnInfo.columnName],
                    () => true,
                    () => this.dynamicElements.imports.push("import com.baomidou.mybatisplus.annotations.TableField;\n"));

                let fieldElement = new Element(prefix + "private _fieldType _fieldName;\n", ["_fieldType", "_fieldName"],
                    (_, columnInfo) => [columnInfo.simpleFieldType, columnInfo.fieldName]);
                // 字段生成
                if (columnInfos) {
                    for (let columnInfo of columnInfos) {
                        let commentContent = commentElement.handleContent(this.options, columnInfo);
                        let swaggerContent = swaggerElement.handleContent(this.options, columnInfo);
                        let mybatisContent = mybatisPlusElement.handleContent(this.options, columnInfo);
                        let fieldContent = fieldElement.handleContent(this.options, columnInfo);
                        let dateFormatontent = dateFormatElement.handleContent(this.options, columnInfo);
                        let jsonFormatontent = jsonFormatElement.handleContent(this.options, columnInfo);

                        let fieldInfo = `${commentContent}${swaggerContent}${dateFormatontent}${jsonFormatontent}${mybatisContent}${fieldContent}`;
                        this.dynamicElements.fields.push(fieldInfo);

                        if (columnInfo.fieldType.length > columnInfo.simpleFieldType.length) {
                            this.dynamicElements.imports.push("import " + columnInfo.fieldType + ";\n");
                        }
                        // get set 方法生成
                        // 如果使用lombok方式 则不生成getter setter
                        this.dynamicElements.methods.push(this.makeGetter(columnInfo.simpleFieldType, columnInfo.fieldName));
                        this.dynamicElements.methods.push(this.makeSetter(columnInfo.simpleFieldType, columnInfo.fieldName));
                    }
                }
            }));
    }

    /**
     * 生成class
     * @returns 
     */
    weaveContent(): string {
        let packageContent = this.elements.get('package')?.handleContent(this.options, this.columnInfos[0], this.columnInfos) || '';
        let classCommentContent = this.elements.get('classComment')?.handleContent(this.options, this.columnInfos[0], this.columnInfos) || '';
        let lombokDataContent = this.elements.get('lombok.Data')?.handleContent(this.options, this.columnInfos[0], this.columnInfos) || '';
        let swaggerModelContent = this.elements.get('swagger.model')?.handleContent(this.options, this.columnInfos[0], this.columnInfos) || '';
        let tableNameContent = this.elements.get('tableName')?.handleContent(this.options, this.columnInfos[0], this.columnInfos) || '';
        this.elements.get('fields')?.handleContent(this.options, this.columnInfos[0], this.columnInfos);

        // 拼接imports
        let importsContent = Array.from(new Set(this.dynamicElements.imports)).sort((a, b) => a.localeCompare(b)).join("");
        let methodsContent = this.options.isSwagger ? '' : this.dynamicElements.methods.join("");
        let className = this.columnInfos[0].className;
        let fieldContent = this.dynamicElements.fields.join("\n");

        // ~ ------------------------------------------------------------------------------------------
        // 添加class
        let classElementFlag = ["_package", "_imports", "_classComment", "_@Data", "_@SwaggerModel", "_@tableName",
            "_className", "_fields", "_methods"];
        let classElement = new Element(javaClass, classElementFlag,
            () => [packageContent, importsContent, classCommentContent, lombokDataContent,
                swaggerModelContent, tableNameContent, className, fieldContent, methodsContent]);

        let content = classElement.handleContent(this.options, this.columnInfos[0], this.columnInfos);
        console.log('生成文本结果', content);
        return content;
    }



    private makeGetter(fieldType: string, fieldName: string) {
        let fieldNameUpper = fieldName.replace(fieldName.charAt(0), fieldName.charAt(0).toUpperCase());

        return `
    public ${fieldType} get${fieldNameUpper} () {
        return this.${fieldName};
    }
        `;

    }

    private makeSetter(fieldType: string, fieldName: string) {
        let fieldNameUpper = fieldName.replace(fieldName.charAt(0), fieldName.charAt(0).toUpperCase());

        return `
    public void set${fieldNameUpper} (${fieldType} ${fieldName}) {
        this.${fieldName} = ${fieldName};
    }
        `;
    }

}


