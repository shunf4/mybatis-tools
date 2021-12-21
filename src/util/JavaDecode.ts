class InterfaceDecode {

    interface() {
        
    }

    method() {

    }
}

class InterfaceInfo {
    /** 全限定路径名称 */
     type:string;
     shortName: string;
     methods: MethodInfo[];
}

class MethodInfo() {
     scope: string;
     returnType: string;
     methodName: string;
     paramInfo: ParamInfo[];

}

class ParamInfo {
    /** 全限定路径名称 */
     type: string;
     shortName: string;
     paramName: string;
     annotation: AnnotationInfo;

}

class AnnotationInfo {
    /** 全限定路径名称 */
     type: string;
     name: string;
    
}

class Constant {
    static NAME = "[\u00C0-\u02B8a-zA-Z_$][\u00C0-\u02B8a-zA-Z_$0-9]*";
    static PATTERN_TYPE = /class|interface\s+(${NAME})\s+/;
    static PATTERN_METHOD = 

}