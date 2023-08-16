/**
 * 保留原始格式的字符串化
 * @param reg
 */
export const regExpToString = (reg: RegExp): string => reg.toString();


/**
 *
 * @param regStr 将字符串形式的正则表达式转换为正则类型
 * @returns
 */
export const stringToRegExp = (regStr: string): RegExp => {

    let lastSplitIndex = regStr.lastIndexOf('/');
    let flag = regStr.substring(lastSplitIndex + 1);
    if (!flag) {
        flag = 'i';
    }
    regStr = regStr.substring(0, lastSplitIndex + 1);
    if (regStr.startsWith("/") && regStr.endsWith('/')) {
        regStr = regStr.substring(1, regStr.length - 1);
    } else {
        throw new Error("正则表达式格式错误");
    }
    return new RegExp(regStr, flag);
};