
/**
 * 生成文件的策略信息
 */
export class FileGenerateOption {

    tag: string = '';
    tableName: string = '';
    projectPath: string = '';
    parentPackage: string = '';

    entityPath: string = '';
    interfacePath: string = '';
    xmlPath: string = '';

    // ~ ------------------------------------------------------------------------------
    // 其他生成属性配置
    // ~ ------------------------------------------------------------------------------


    /** 如果不使用lombok 则生成getter setter */
    isUseLombok: boolean = true;
    /** 如果不使用swagger 则使用注释 */
    isSwagger: boolean = true;


}