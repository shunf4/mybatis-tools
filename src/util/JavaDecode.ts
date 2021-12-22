/* eslint-disable @typescript-eslint/naming-convention */
class InterfaceDecode {
  interface() {}

  static method(javaContent: string | undefined): string[] | null {
    if (javaContent === undefined) {
      return null;
    }
    return javaContent.match(Constant.PATTERN_ABSTRACT_METHOD_NAME);
  }

  static package(javaContent: string | undefined): string[] | null {
    if (javaContent === undefined) {
      return null;
    }
    return javaContent.match(Constant.PATTERN_PACKAGE);
  }
}

export class Constant {
  static NAME = "[\u00C0-\u02B8a-zA-Z_$][\u00C0-\u02B8a-zA-Z_$0-9]*";
  static PATTERN_ABSTRACT_METHOD_NAME = eval(`(?<=\s+)(${Constant.NAME})(?=\s*\()`);
  static PATTERN_PACKAGE = eval(`(?<=package\s+)(${Constant.NAME})(?=\s*;)`);
  static PATTERN_NAME = eval(`/${Constant.NAME}/`);
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

export { InterfaceDecode };
