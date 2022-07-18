import { ColumnInfo } from './../data/DataType';
import { FileGenerateOption } from './../../model/FileGenerateOption';

interface IFileGenerate {

    /**
     * 模板加载
     */
    loadTemplate(): void;

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

    constructor(options: FileGenerateOption, columnInfos: ColumnInfo[]) {
        this.options = options;
        this.columnInfos = columnInfos;
    }


    loadTemplate(): void {
        throw new Error('Method not implemented.');
    }

    weaveContent(): void {
        throw new Error('Method not implemented.');
    }

    writeFile(): void {
        throw new Error('Method not implemented.');

    }

}
