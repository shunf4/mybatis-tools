import { Element } from "./ElementDefine";
import { BaseFileGenerate } from "./FileGenerate";
import * as vscode from 'vscode';

const mapperInterface = `
_package
_imports

_comment
public interface _mapperName extends BaseMapper<_className> {

}
`;


const mapperComment: string = `
/**
 * _tableComment mapper
 *
 * @author _author
 */`;


/**
 * 生成mapper接口文件
 */
export class MapperFileGenerate extends BaseFileGenerate {

    init(): void {
        this.elements.set("package", new Element("package _packagePath;\n", ["_packagePath"],
            options => {
                let path: string[] = [];
                if (options.parentPackage) {
                    path.push(options.parentPackage);
                }
                if (options.interfacePath) {
                    path.push(options.interfacePath);
                }
                return [path.join(".")];
            }));

        this.elements.set("classComment", new Element(mapperComment, ['_tableComment', '_author'],
            (options, columnInfo) => [columnInfo.tableComment, options.author],
            () => true));

        this.dynamicElements.imports.push("import com.baomidou.mybatisplus.mapper.BaseMapper;\n");
    }

    weaveContent(): void {
        let packageContent = this.elements.get("package")?.handleContent(this.options, this.columnInfos[0], this.columnInfos) || '';
        let classCommentContent = this.elements.get("classComment")?.handleContent(this.options, this.columnInfos[0], this.columnInfos) || '';

        let className = this.columnInfos[0].className;
        let mapperName = this.columnInfos[0].mapperName;

        let classPath: string[] = [];
        if (this.options.parentPackage) {
            classPath.push(this.options.parentPackage);
        }
        if (this.options.entityPath) {
            classPath.push(this.options.entityPath);
        }
        if (this.columnInfos[0].className) {
            classPath.push(this.columnInfos[0].className);
        }
        let classFullPath = classPath.join(".");
        let classPackage = `import ${classFullPath};\n`;
        this.dynamicElements.imports.push(classPackage);
        let importsContent = Array.from(new Set(this.dynamicElements.imports)).sort((a, b) => a.localeCompare(b)).join("");

        let elementFlag = ["_package", "_imports", "_comment", "_mapperName", "_className"];
        let classElement = new Element(mapperInterface, elementFlag,
            () => [packageContent, importsContent, classCommentContent, mapperName, className]);
        let mapperContent = classElement.handleContent(this.options, this.columnInfos[0], this.columnInfos);
        console.log("生成mapper", mapperContent);
        this.content = mapperContent;
    }

    getDirectory(projectPath: vscode.Uri): vscode.Uri {
        return vscode.Uri.joinPath(projectPath, this.mainPath,
            this.options.parentPackage.replace(/\./g, '/'),
            this.options.interfacePath.replace(/\./g, '/')
        );
    }

    getFileName(): string {
        return this.columnInfos[0].mapperName + '.java';
    }

}