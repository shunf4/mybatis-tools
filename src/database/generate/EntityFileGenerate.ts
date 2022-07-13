import { BaseFileGenerate } from "./FileGenerate";
import {FileGenerateOption} from "../../model/FileGenerateOption";
import {ColumnInfo} from "../data/DataType";

export class EntityFileGenerate extends BaseFileGenerate {




    loadTemplate() {
        super.loadTemplate();
    }

    weaveContent(options: FileGenerateOption, columnInfos: ColumnInfo[]) {
        super.weaveContent(options, columnInfos);
    }

    writeFile(path: string) {
        super.writeFile(path);
    }
}