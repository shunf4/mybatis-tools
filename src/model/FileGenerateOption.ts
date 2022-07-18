
/**
 * 生成文件的策略信息
 */
export class FileGenerateOption {

    /** 使用数据库配置tag */
    tag: string = '';
    /** 数据库类型 */
    type: string = '';
    tableName: string = '';
    projectPath: string = '';
    parentPackage: string = '';

    entityPath: string = '';
    interfacePath: string = '';
    xmlPath: string = '';

    // ~ ------------------------------------------------------------------------------
    // 其他生成属性配置
    // ~ ------------------------------------------------------------------------------

    author: string = 'auto generate';

    /** 如果不使用lombok 则生成getter setter */
    isUseLombok: boolean = true;
    /** 如果不使用swagger 则使用注释 */
    isSwagger: boolean = true;


}