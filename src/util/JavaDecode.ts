/* eslint-disable @typescript-eslint/naming-convention */
/**
 * 最初的想法是写一个java文件解析的方法（或者是第三方的）
 * 但是后来想了一下，这与插件的功能相差甚远。
 * 因此直接根据正则表达式进行提取。
 */
class InterfaceDecode {

    static method(javaContent: string | undefined): { name: string, position: number }[] | null {
        if (javaContent === undefined) {
            return null;
        }

        return Array.from(javaContent.matchAll(Constant.PATTERN_ABSTRACT_METHOD_NAME)).map(m => {
            return {
                name: m[0],
                position: m.index || 0,
            };
        });
    }

    static package(javaContent: string | undefined): string | null {
        if (javaContent === undefined) {
            return null;
        }
        let packages = javaContent.trim().match(Constant.PATTERN_PACKAGE) || [""];
        return packages[0];
    }
}

export class Constant {
    static NAME = "[\\u00C0-\\u02B8a-zA-Z_$][\\u00C0-\\u02B8a-zA-Z_$0-9]*";
    static NAMESPACE = "[\\u00C0-\\u02B8a-zA-Z_$][\\u00C0-\\u02B8a-zA-Z_$0-9.]*";
    static PATTERN_ABSTRACT_METHOD_NAME = new RegExp(`(?<=\\s+)(${Constant.NAME})(?=\\s*\\()`, "g");
    static PATTERN_PACKAGE = new RegExp(`(?<=^package\\s+)(${Constant.NAMESPACE})(?=\\s*;)`);
    static PATTERN_NAME = new RegExp(`${Constant.NAME}`, "g");
    static PATTERN_CHAR = /[\u00C0-\u02B8a-zA-Z_$0-9\.]/;
    static PATTERN_NAMESPACE = new RegExp(`(?<=namespace\\s*\\=\\s*")${Constant.NAMESPACE}(?=")`);

    static PATTERN_FILE_SCAN = "**/src/main/**/*.xml";
    static PATTERN_FILE_JAVA_AND_XML_SCAN = "{**/src/main/**/*.java,**/src/main/**/*.xml}";
    static PATTERN_FILE_SCAN_BASE = "**/src/main/**/";

    static getJavaPathByNamespace(namespace: string): string {
        let classPath = namespace.replace(/\./g, '/');
        return "**/src/main/java/" + classPath + ".java";
    }

    static getXmlPathByNamespace(namespace: string): string {
        let xmlPath = namespace.replace(/\./g, '/');
        return "**/src/main/**/" + xmlPath + ".xml";
    }
}

export {InterfaceDecode};
