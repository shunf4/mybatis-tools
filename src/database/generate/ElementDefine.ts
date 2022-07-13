import { FileGenerateOption } from "../../model/FileGenerateOption";
import { ColumnInfo } from "../data/DataType";


const javaClass: string = `
package _package;

_imports

_@Data
_@tableName
public class _className {

_fields

_methods

}
`;

interface ElementRule {
    (options: FileGenerateOption): boolean;
}

interface ElementApply {
    (options: FileGenerateOption, columnInfos?: ColumnInfo[]): void;
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
        if (!this.rule(options)) {
            return '';
        }
        // 如果符合规则, 则执行定义操作
        this.apply(options);
        let values = this.values(options, columnInfo);
        if (!values) {
            return '';
        }
        // 文本内容的替换
        let resultContent = '';
        for (let index in this.dynamics) {
            resultContent += this.content.replace(this.dynamics[index], values[index]);
        }
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
class Elements {

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

        // ~ ------------------------------------------------------------------------------------------
        // 添加lombok
        this.elements.set("lombok.Data", new Element("@Data\n", [],
            () => [],
            options => options.isUseLombok,
            () => this.dynamicElements.imports.push("import lombok.Data;\n")));

        // ~ ------------------------------------------------------------------------------------------
        // 添加mybatis-plus
        this.elements.set("tableName", new Element("@TableName(\"_tableName\")\n", ["_tableName"],
            options => [options.tableName],
            () => true,
            () => this.dynamicElements.imports.push("import com.baomidou.mybatisplus.annotations.TableName;\n")));

        // ~ ------------------------------------------------------------------------------------------
        // 添加字段
        this.elements.set("fields", new Element("", [], () => [],
            () => true, (options, columnInfos) => {

                let commentElement = new Element("/** _comment */\n", ["_comment"],
                    (_, columnInfo) => [columnInfo.columnComment],
                    () => !options.isSwagger);
                let swaggerElement = new Element("@ApiModelProperty(\"_comment\")\n", ["_comment"],
                    (_, columnInfo) => [columnInfo.columnComment],
                    () => options.isSwagger,
                    () => this.dynamicElements.imports.push("import io.swagger.annotations.ApiModelProperty;\n"));

                let mybatisPlusElement = new Element("@TableField(\"_columnName\")\n", ["_columnName"],
                    (_, columnInfo) => [columnInfo.columnName],
                    () => true,
                    () => this.dynamicElements.imports.push("import com.baomidou.mybatisplus.annotations.TableField;\n"));

                let fieldElement = new Element("private _fieldType _fieldName;\n", ["_fieldType", "_fieldName"],
                    (_, columnInfo) => [columnInfo.fieldType, columnInfo.fieldName]);
                // 字段生成
                if (columnInfos) {
                    for (let columnInfo of columnInfos) {
                        let commentContent = commentElement.handleContent(this.options, columnInfo);
                        let swaggerContent = swaggerElement.handleContent(this.options, columnInfo);
                        let mybatisContent = mybatisPlusElement.handleContent(this.options, columnInfo);
                        let fieldContent = fieldElement.handleContent(this.options, columnInfo);

                        let fieldInfo = `${commentContent}${swaggerContent}${mybatisContent}${fieldContent}`;
                        this.dynamicElements.fields.push(fieldInfo);
                    }
                }
            }));

    }

    weaveContent(): string {
        let classElementFlag = ["_package", "_imports", "_@Data", "_@TableName", "_className", "_fields", "_methods"];
        let packageContent = this.elements.get('package')?.handleContent(this.options, this.columnInfos[0], this.columnInfos) || '';
        let lombokDataContent = this.elements.get('lombok.Data')?.handleContent(this.options, this.columnInfos[0], this.columnInfos) || '';
        let tableNameContent = this.elements.get('tableName')?.handleContent(this.options, this.columnInfos[0], this.columnInfos) || '';
        let fieldContent = this.elements.get('fields')?.handleContent(this.options, this.columnInfos[0], this.columnInfos) || '';

        // 拼接imports
        let importsContent = this.dynamicElements.imports.join("");
        let methodsContent = this.dynamicElements.methods.join("");
        let className = this.columnInfos[0].className;

        // ~ ------------------------------------------------------------------------------------------
        // 添加class
        let classElement = new Element(javaClass, classElementFlag,
            () => [packageContent, importsContent, lombokDataContent,
                tableNameContent, className, fieldContent, methodsContent]);

        return classElement.handleContent(this.options, this.columnInfos[0], this.columnInfos);
    }

}


