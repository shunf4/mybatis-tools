import { Element } from "./ElementDefine";
import { BaseFileGenerate } from "./FileGenerate";
import * as vscode from 'vscode';

const xmlTemplate = `
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd" >
<mapper namespace="_mapperFullPath" >

    <resultMap id="BaseResultMap" type="_classFullPath" >
_resultMap
    </resultMap>

    <sql id="Base_Column_List">
        _columnList
    </sql>

</mapper>
`;

const prefix = '        ';
const resultTemplate = prefix + `<result property="_field" column="_column" jdbcType="_jdbcType"/>\n`;
const resultIdTemplate = prefix + `<id property="_field" column="_column" jdbcType="_jdbcType"/>\n`;


export class XmlFileGenerate extends BaseFileGenerate {
    init(): void {
        this.elements.set("resultMaps", new Element(resultTemplate, ["_field", "_column", "_jdbcType"],
            (_, columnInfo) => [columnInfo.fieldName, columnInfo.columnName, columnInfo.jdbcType]));
        this.elements.set("resultIdMaps", new Element(resultIdTemplate, ["_field", "_column", "_jdbcType"],
            (_, columnInfo) => [columnInfo.fieldName, columnInfo.columnName, columnInfo.jdbcType]));
    }
    weaveContent(): void {
        let columns: string[] = [];
        let resultMapContent = '';
        for (const columnInfo of this.columnInfos) {
            columns.push(columnInfo.columnName);
            let type = columnInfo.isId ? "resultIdMaps" : "resultMaps";
            let rowResult = this.elements.get(type)?.handleContent(this.options, columnInfo, this.columnInfos) || '';
            resultMapContent += rowResult;
        }

        let mapperFullPathContent = `${this.options.parentPackage}.${this.options.interfacePath}.${this.columnInfos[0].mapperName}`;
        let classFullPathContent = `${this.options.parentPackage}.${this.options.entityPath}.${this.columnInfos[0].className}`;

        let xmlContent = new Element(xmlTemplate, ["_mapperFullPath", "_classFullPath", "_resultMap", "_columnList"],
            () => [mapperFullPathContent, classFullPathContent, resultMapContent, columns.join(", ")]
        ).handleContent(this.options, this.columnInfos[0], this.columnInfos);

        console.log("生成xml文件", xmlContent);
        this.content = xmlContent;
    }


    writeFile(): void {
        let projectPath = vscode.Uri.parse(this.options.projectPath);
        let fileDirectory = vscode.Uri.joinPath(projectPath,
            this.options.parentPackage.replace(/\./g, '/'),
            this.options.xmlPath.replace(/\./g, '/')
        );
        let filePath = vscode.Uri.joinPath(projectPath,
            this.options.parentPackage.replace(/\./g, '/'),
            this.options.xmlPath.replace(/\./g, '/'),
            this.columnInfos[0].mapperName + '.xml'
        );

        vscode.workspace.fs.createDirectory(fileDirectory).then(() => {
            vscode.workspace.fs.writeFile(filePath, Buffer.from(this.content));
        });
    }

} 