import { BaseFileGenerate } from "./FileGenerate";
import { Element } from "./ElementDefine";
import * as vscode from 'vscode';


const javaClass: string = `
_package

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


/**
 * 数据库实体类生成
 * todo zx 提高配置度
 * 允许通过配置的方式指定模板, 模板中占位符, 以及占位符对应的取值方式
 * 提供给前端可以选择的变量名称, 之后通过变量取值
 * 允许执行编排
 * 
 * 麻烦不想做了
 */
export class EntityFileGenerate extends BaseFileGenerate {

    init(): void {
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

                // ~ --------------------------
                // 字段注释
                let commentElement = new Element(prefix + "/** _comment */\n", ["_comment"],
                    (_, columnInfo) => [columnInfo.columnComment],
                    () => !options.isSwagger);
                // ~ --------------------------
                // swagger字段注释
                let swaggerElement = new Element(prefix + "@ApiModelProperty(\"_comment\")\n", ["_comment"],
                    (_, columnInfo) => [columnInfo.columnComment],
                    () => options.isSwagger,
                    () => this.dynamicElements.imports.push("import io.swagger.annotations.ApiModelProperty;\n"));

                // ~ --------------------------
                // 时间格式化
                let dateFormatElement = new Element(prefix + "@DateTimeFormat(pattern = \"yyyy-MM-dd HH:mm:ss\")\n", [],
                    () => [],
                    (_, columnInfo) => ["Date", "LocalDateTime"].includes(columnInfo.simpleFieldType),
                    () => this.dynamicElements.imports.push("import org.springframework.format.annotation.DateTimeFormat;\n"));

                // ~ --------------------------
                // 时间格式化
                let jsonFormatElement = new Element(prefix + "@JsonFormat(pattern = \"yyyy-MM-dd HH:mm:ss\", timezone = \"GMT+8\")\n", [],
                    () => [],
                    (_, columnInfo) => ["Date", "LocalDateTime"].includes(columnInfo.simpleFieldType),
                    () => this.dynamicElements.imports.push("import com.fasterxml.jackson.annotation.JsonFormat;\n"));

                // ~ --------------------------
                // mybatis-plus字段注释
                let mybatisPlusElement = new Element(prefix + "@TableField(\"_columnName\")\n", ["_columnName"],
                    (_, columnInfo) => [columnInfo.columnName],
                    () => true,
                    () => this.dynamicElements.imports.push("import com.baomidou.mybatisplus.annotations.TableField;\n"));

                let mybatisPlusIdElement = new Element(prefix + "@TableId(value = \"_columnName\", type = IdType._idType)\n", ["_columnName", '_idType'],
                    (option, columnInfo) => {
                        let idType: string;
                        if (!option.idType || option.idType.length === 0) {
                            if (columnInfo.simpleFieldType === 'String') {
                                idType = 'UUID';
                            } else {
                                idType = 'AUTO';
                            }
                        } else {
                            idType = option.idType;
                        }
                        return [columnInfo.columnName, idType];
                    },
                    () => true,
                    () => {
                        this.dynamicElements.imports.push("import com.baomidou.mybatisplus.annotations.TableId;\n");
                        this.dynamicElements.imports.push("import com.baomidou.mybatisplus.enums.IdType;\n");
                    });

                // ~ --------------------------
                // 字段信息
                let fieldElement = new Element(prefix + "private _fieldType _fieldName;\n", ["_fieldType", "_fieldName"],
                    (_, columnInfo) => [columnInfo.simpleFieldType, columnInfo.fieldName]);

                // 字段生成以及相关动态元素添加
                if (columnInfos) {
                    for (let columnInfo of columnInfos) {
                        let commentContent = commentElement.handleContent(this.options, columnInfo);
                        let swaggerContent = swaggerElement.handleContent(this.options, columnInfo);
                        let mybatisContent: string;
                        if (columnInfo.isId) {
                            mybatisContent = mybatisPlusIdElement.handleContent(this.options, columnInfo);
                        } else {
                            mybatisContent = mybatisPlusElement.handleContent(this.options, columnInfo);
                        }
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

    weaveContent(): void {
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
        console.log('生成entity', content);
        this.content = content;
    }

    writeFile(): void {
        let projectPath = vscode.Uri.parse(this.options.projectPath);
        let fileDirectory = vscode.Uri.joinPath(projectPath,
            this.options.parentPackage.replace(/\./g, '/'),
            this.options.entityPath.replace(/\./g, '/')
        );
        let filePath = vscode.Uri.joinPath(projectPath,
            this.options.parentPackage.replace(/\./g, '/'),
            this.options.entityPath.replace(/\./g, '/'),
            this.columnInfos[0].className + '.java'
        );

        vscode.workspace.fs.createDirectory(fileDirectory).then(() => {
            vscode.workspace.fs.writeFile(filePath, Buffer.from(this.content));
        });
    }


    /**
     * 生成get方法
     * @param fieldType 
     * @param fieldName 
     * @returns 
     */
    private makeGetter(fieldType: string, fieldName: string) {
        let fieldNameUpper = fieldName.replace(fieldName.charAt(0), fieldName.charAt(0).toUpperCase());

        return `
    public ${fieldType} get${fieldNameUpper} () {
        return this.${fieldName};
    }
        `;

    }

    /**
     * 生成set方法
     * @param fieldType 
     * @param fieldName 
     * @returns 
     */
    private makeSetter(fieldType: string, fieldName: string) {
        let fieldNameUpper = fieldName.replace(fieldName.charAt(0), fieldName.charAt(0).toUpperCase());

        return `
    public void set${fieldNameUpper} (${fieldType} ${fieldName}) {
        this.${fieldName} = ${fieldName};
    }
        `;
    }

}