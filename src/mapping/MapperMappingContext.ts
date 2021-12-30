import { XMLParser } from "fast-xml-parser";
import * as vscode from "vscode";
import { Constant, InterfaceDecode } from "../util/JavaDecode";

/**
 * <p>mapper mapping 上下文
 * 目前只进行接口<-->xml的缓存.
 * 方法的缓存在实际打开文件进行跳转时处理.
 *
 * 进行方法缓存意义不大，反而会造成加载缓慢 因此目前不做处理
 */
export class MapperMappingContext {
  private static prefixSearch = "**/";
  private static suffixSearch = ".java";
  private static mapperMappingMap = new Map<string, MapperMapping>();

  private static options = {
    attributeNamePrefix: "@_",
    attrNodeName: "attr", //default is 'false'
    textNodeName: "#text",
    ignoreAttributes: false,
    ignoreNameSpace: false,
    allowBooleanAttributes: true,
    parseNodeValue: true,
    parseAttributeValue: true,
    trimValues: true,
    cdataTagName: "__cdata", //default is 'false'
    cdataPositionChar: "\\c",
    parseTrueNumberOnly: false,
    numParseOptions: {
      hex: true,
      leadingZeros: true,
      //skipLike: /\+[0-9]{10}/
    },
    arrayMode: false, //"strict"
    // attrValueProcessor: (val: any, attrName: any) => he.decode(val, { isAttributeValue: true }), //default is a=>a
    // tagValueProcessor: (val: any , tagName) => he.decode(val), //default is a=>a
    // stopNodes: ["parse-me-as-string"],
    alwaysCreateTextNode: true,
  };

  /**
   * 将xml字符串解析为MapperMapping对象, 并将其注册到MapperMappingContext中
   * how to use xpath-ts: {@link https://www.npmjs.com/package/xpath-ts }
   * @param xmlContent xml字符串
   * @returns 返回当前文件的namespace
   */
  static async registryMapperXmlFile(file: vscode.Uri): Promise<MapperMapping | null> {
    let readData = await vscode.workspace.fs.readFile(file);
    let xmlContent = Buffer.from(readData).toString("utf8");

    const parser = new XMLParser(MapperMappingContext.options);
    let mapperObject = parser.parse(xmlContent);
    if (mapperObject === undefined || !mapperObject) {
      return null;
    }
    if (mapperObject.mapper === undefined || !mapperObject.mapper) {
      return null;
    }
    let namespace = mapperObject.mapper["@_namespace"];
    let mapperMapping = new MapperMapping(namespace);
    mapperMapping.xmlPath = vscode.Uri.parse(file.path);

    let relativePath = this.prefixSearch + namespace.replace(/\./g, "/") + this.suffixSearch;
    let files = await vscode.workspace.findFiles(relativePath);
    if (files && files.length > 0) {
      mapperMapping.javaPath = files[0];
    }
    MapperMappingContext.registryMapperMapping(mapperMapping);
    return mapperMapping;
  }

  static clean() {
    MapperMappingContext.mapperMappingMap.clear();
  }

  private static async registryMapperMapping(mapperMapping: MapperMapping) {
    // 校验namespace是否存在
    let namespace = mapperMapping.namespace;
    MapperMappingContext.mapperMappingMap.set(namespace, mapperMapping);
  }

  static async printMapperMappingMap() {
    console.log("mapper映射集为: ", MapperMappingContext.mapperMappingMap);
  }

  static summeryInfo(): string {
    let size = MapperMappingContext.mapperMappingMap.size;
    return `映射数量: ${size}`;
  }

  /**
   * 通过命名空间查找映射结果
   * 首先从缓存中获取
   * 获取不到进行全查找
   * @param namespace
   * @returns
   */
  static async getMapperMapping(namespace: string): Promise<MapperMapping> {
    // 从缓存中获取
    let mapperMappingValue = MapperMappingContext.mapperMappingMap.get(namespace);

    if (mapperMappingValue) {
      return mapperMappingValue;
    }
    // 缓存中不存在查找所有xml文件 进行匹配获取
    // 如果你的文件名称.java 与 .xml相同我们会通过getMapperMappingByOtherFile进行获取
    let files = await vscode.workspace.findFiles("**/*.xml");
    for (const file of files) {
      await MapperMappingContext.registryMapperXmlFile(file);
      mapperMappingValue = MapperMappingContext.mapperMappingMap.get(namespace);
      if (mapperMappingValue) {
        return mapperMappingValue || new MapperMapping(namespace);
      }
    }
    return mapperMappingValue || new MapperMapping(namespace);
  }

  /**
   * 根据java文件名 命名空间 查找
   * @param fileName
   * @param namespace
   * @returns
   */
  static async getMapperMappingByJavaFile(document: vscode.TextDocument): Promise<MapperMapping> {
    let content = document.getText();
    let packageName = InterfaceDecode.package(content);

    let filePath = document.fileName;
    let fileShortName = filePath.substring(filePath.lastIndexOf("\\") + 1, filePath.lastIndexOf("."));

    let namespace = packageName + "." + fileShortName;
    let mapperMappingValue = MapperMappingContext.mapperMappingMap.get(namespace);
    if (mapperMappingValue) {
      return mapperMappingValue || new MapperMapping(namespace);
    }

    let files = await vscode.workspace.findFiles("**/" + fileShortName + ".xml");
    for (const file of files) {
      await MapperMappingContext.registryMapperXmlFile(file);
    }
    return MapperMappingContext.getMapperMapping(namespace);
  }

  /**
   * 根据 xml及命名空间查找
   * @param fileNameWithSuffix
   * @param namespace
   */
  static async getMapperMappingByXmlFile(document: vscode.TextDocument): Promise<MapperMapping> {
    let content = document.getText();
    let namespace = (content.match(Constant.PATTERN_NAMESPACE) || [""])[0].trim();
    let mapperMappingValue = MapperMappingContext.mapperMappingMap.get(namespace);
    if (mapperMappingValue) {
      return mapperMappingValue || new MapperMapping(namespace);
    }
    mapperMappingValue = (await MapperMappingContext.registryMapperXmlFile(document.uri)) || new MapperMapping(namespace);
    return mapperMappingValue;
  }

  static async reload() {}
}

class MapperMapping {
  namespace: string;
  xmlPath?: vscode.Uri;
  javaPath?: vscode.Uri;
  xmlIds: string[] = [];
  javaIds: string[] = [];

  constructor(namespace: string, xmlPath?: vscode.Uri | undefined, javaPath?: vscode.Uri | undefined) {
    this.namespace = namespace;
    this.xmlPath = xmlPath;
    this.javaPath = javaPath;
  }
}

// a mapper is like:

// <?xml version="1.0" encoding="UTF-8"?>
// <!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
// <mapper namespace="com.nikola.back.sys.mapper.PermissionRoleMapperExt">
//     <select id="selectListByPermissionId" resultType="com.nikola.back.sys.entity.model.PermissionRoleDO">
//         SELECT
//             pr.permission_id permissionId,
//             pr.role_id roleId,
//             sr.role_name roleName,
//             sp.url permissionUrl
//         FROM permission_role pr
//         LEFT JOIN sys_role sr ON sr.id = pr.role_id
//         LEFT JOIN sys_permission sp ON sp.id = pr.permission_id
//         WHERE pr.permission_id = #{permissionId}
//     </select>
// </mapper>
