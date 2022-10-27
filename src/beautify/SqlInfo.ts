class SqlInfo {

    /** sql类型 */
    type?: string = 'mysql';
    
    /** sql文本 */
    text: string;

    /** sql层级 */
    layers?: string[];

    constructor(text: string) { 
        this.text = text;
    }

}