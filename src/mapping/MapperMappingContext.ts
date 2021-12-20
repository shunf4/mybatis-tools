import { DOMParserImpl as dom } from "xmldom-ts";
import * as xpath from "xpath-ts";

export class MapperMappingContext {
  private mapperMappings: MapperMapping[];

  /**
   * 将xml字符串解析为MapperMapping对象, 并将其注册到MapperMappingContext中
   * how to use xpath-ts: {@link https://www.npmjs.com/package/xpath-ts }
   * @param xmlContent xml字符串
   * @returns 是否解析成功
   */
  registryMapperMapping(xmlContent: string): boolean {
    let doc = new dom().parseFromString(xmlContent);

    // 获取namespace
    let namespace: string = xpath.select1("/mapper/@namespace", doc).value;
    if (namespace !== undefined || !namespace) {
      return false;
    }

    return true;
  }
}

class MapperMapping {
  private namespace: string;
  private xmlMapper: XmlMapper;
  private xmlPath: string;
  private interfacePath: string;
}

class XmlMapper {}

class InterfaceMapper {}


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
