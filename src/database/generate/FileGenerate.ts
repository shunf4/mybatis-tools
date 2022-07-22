import { ColumnInfo } from "./../data/ColumnInfo";
import { FileGenerateOption } from './../../model/FileGenerateOption';
import { DynamicElements, Element } from './ElementDefine';
import * as vscode from 'vscode';

interface IFileGenerate {


    /**
     * 生成文件供外部调用
     */
    generate(): void;

    /**
     * 模板加载
     */
    init(): void;

    /**
     * 内容生成
     */
    weaveContent(): void;

    /**
     * 文件生成
     */
    writeFile(): void;

}


export abstract class BaseFileGenerate implements IFileGenerate {

    options: FileGenerateOption;

    columnInfos: ColumnInfo[];

    content: string = '';

    mainPath = 'src/main/java';
    resourcePath = 'src/main/resources';

    elements: Map<string, Element> = new Map<string, Element>();
    dynamicElements: DynamicElements = new DynamicElements();

    constructor(options: FileGenerateOption, columnInfos: ColumnInfo[]) {
        this.options = options;
        this.columnInfos = columnInfos;
        this.init();
    }

    /**
     * 初始化
     */
    abstract init(): void;

    /**
     * 内容编织
     */
    abstract weaveContent(): void;



    generate(): void {
        this.init();
        this.weaveContent();
        if (this.content && this.content.length > 0) {
            this.writeFile();
        } else {
            throw new Error("没有生成任何内容");
        }
    }

    /**
     * 生成文件
     */
    writeFile(): void {
        let projectPath = vscode.Uri.parse(this.options.projectPath);
        let directory: vscode.Uri;
        if (!this.options.parentPackage || this.options.parentPackage.length === 0) {
            // 顶级包不存在 忽略子目录配置，所有文件生成在项目路径下
            directory = projectPath;
        } else {
            // 否则通过子类获取对应文件目录
            directory = this.getDirectory(projectPath);
        }

        let fileName = this.getFileName();
        if (!fileName || fileName.length === 0) {
            return;
        }
        let path = vscode.Uri.joinPath(directory, fileName);
        vscode.workspace.fs.createDirectory(directory).then(() => {
            vscode.workspace.fs.writeFile(path, Buffer.from(this.content));
        });
    }

    /**
     * 文件生成目录
     */
    abstract getDirectory(projectPath: vscode.Uri): vscode.Uri;

    /**
     * 获取文件名
     */
    abstract getFileName(): string;

}
