/* eslint-disable @typescript-eslint/naming-convention */
class InterfaceDecode {
  interface() {}

  method(javaContent: string) {
    javaContent.replace(Constant.PATTERN_ABSTRACT_METHOD, "$1");
  }
}

class InterfaceInfo {
  /** 全限定路径名称 */
  type?: string;
  shortName?: string;
  methods?: MethodInfo[];
}

class MethodInfo {
  scope?: string;
  returnType?: string;
  methodName?: string;
  paramInfo?: ParamInfo[];
}

class ParamInfo {
  /** 全限定路径名称 */
  type?: string;
  shortName?: string;
  paramName?: string;
  annotation?: AnnotationInfo;
}

class AnnotationInfo {
  /** 全限定路径名称 */
  type?: string;
  name?: string;
}

class Constant {
  static ACCESS_FLAG = "public|private|protected";
  static NAME = "[a-zA-Z0-9_$]";
  static TYPE_NAME = "[a-zA-Z0-9_$<>]";

  static PATTERN_ABSTRACT_METHOD = eval(
    `/${Constant.ACCESS_FLAG}*\\s+${Constant.TYPE_NAME}+\\s+(${Constant.NAME}+)\\(.*\\);/`
  );
}


// let ACCESS_FLAG = "public|private|protected";
// let NAME = "[a-zA-Z0-9_$]";
// let TYPE_NAME = "[a-zA-Z0-9_$<>]";

// let PATTERN_ABSTRACT_METHOD = eval(
//     `/${ACCESS_FLAG}*\\s+${TYPE_NAME}+\\s+(${NAME}+)\\(.*\\);/`
//     );

// let str1 = 'public void getUserInfo(@Param("name")String name);';


// let str2 = 'public void getUserInfo(@Param("name")String name);' +
//     '\n' +
//     'List<String> listUserInfo(@Param("name")String name);';




// console.log(str1.replace(PATTERN_ABSTRACT_METHOD, "$1"))

// console.log(str2.replace(PATTERN_ABSTRACT_METHOD, "$1").split("\n"))
