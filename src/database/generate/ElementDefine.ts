import { FileGenerateOption } from "../../model/FileGenerateOption";
import { ColumnInfo } from "../data/ColumnInfo";

/**
 * 元素使用规则定义
 */
interface ElementRule {
    (options: FileGenerateOption, columnInfo: ColumnInfo, columnInfos: ColumnInfo[]): boolean;
}

/**
 * 当元素满足规则要执行的步骤
 */
interface ElementApply {
    (options: FileGenerateOption, columnInfo: ColumnInfo, columnInfos?: ColumnInfo[]): void;
}

/**
 * 获取替换文本的值
 */
interface ElementValues {
    (options: FileGenerateOption, columnInfo: ColumnInfo, columnInfos?: ColumnInfo[]): string[];
}


export class Element {
    content: string;
    /** 动态替换内容标记 */
    dynamics: string[];
    /** 如果必须使用该元素则不用设置规则,
     * 配合FileGenerateOption进行过元素是否添加判断,
     * 当然如果满足条件提前操作DynamicElements也是可以的 */
    private rule: ElementRule = () => true;
    /**
     * 生成参数
     */
    private apply: ElementApply = () => [];
    private values: ElementValues = () => [];


    constructor(content: string, dynamics: string[], values?: ElementValues, rule?: ElementRule, apply?: ElementApply) {
        this.content = content;
        this.dynamics = dynamics;

        if (values) {
            this.values = values;
        }
        // 默认规则满足, 默认不执行规则条件下的操作
        if (rule) {
            this.rule = rule;
        }
        if (apply) {
            this.apply = apply;
        }
    }

    /**
     * 处理内容
     * @param values 需要替换的参数
     * @param options 生成策略
     * @param columnInfo 当前操作的字段
     * @param columnInfos 所有的表字段及类字段信息
     */
    handleContent(options: FileGenerateOption, columnInfo: ColumnInfo, columnInfos?: ColumnInfo[]): string {
        if (!this.rule(options, columnInfo, columnInfos || [])) {
            return '';
        }
        // 如果符合规则, 则执行定义操作
        this.apply(options, columnInfo, columnInfos || []);
        let values = this.values(options, columnInfo, columnInfos || []);
        if (!values) {
            return '';
        }
        // 文本内容的替换
        let resultContent = '';
        let contentCopy = this.content;
        if (this.dynamics && this.dynamics.length > 0) {
            for (let index in this.dynamics) {
                contentCopy = contentCopy.replace(this.dynamics[index], values[index]);
            }
        }
        resultContent = contentCopy;
        return resultContent;
    }
}

/**
 * 有些元素的出现是动态的, 随着规则配置变化而变化
 */
export class DynamicElements {
    imports: string[] = [];
    fields: string[] = [];
    methods: string[] = [];
    classAnnotations: string[] = [];
}



