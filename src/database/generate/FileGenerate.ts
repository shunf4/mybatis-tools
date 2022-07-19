import { ColumnInfo } from "./../data/ColumnInfo";
import { FileGenerateOption } from './../../model/FileGenerateOption';
import { DynamicElements, Element } from './ElementDefine';

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

    /**
     * 生成文件
     */
    abstract writeFile(): void;

    generate(): void {
        this.init();
        this.weaveContent();
        if (this.content && this.content.length > 0) {
            this.writeFile();
        } else { 
            throw new Error("没有生成任何内容");
        }
    }


}
