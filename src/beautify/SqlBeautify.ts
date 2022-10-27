abstract class BaseSqlBeautify {

    /**
     * sql美化
     * @param text sql
     */
    abstract beautify(text: string): string;
    /**
     * sql分析, 提取sqlInfo
     * @param text sql
     */
    abstract analysis(text: string): SqlInfo;

}

/**
 * 默认的sql美化方法
 */
class DefaultSqlBeautify extends BaseSqlBeautify {
    keyWordMap = new Map<string, KeyWordAction>();

    constructor() { 
        super();
        this.keyWordMap.set("select", );
    }

    analysis(text: string): SqlInfo {

        
        return new SqlInfo(text);
    }

    beautify(text: string): string {
        let copiedText = text;
        // 提取sql层次
        
        // 递归处理每一层的美化

        return copiedText;
        
    }


}
