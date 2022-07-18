export const sleep = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};


/**
 * 下划线转驼峰
 * @param word 
 * @returns 
 */
export const underlineToHump = (word: string) => {
    let res = '';
    for (let i = 0; i < word.length; i++) {
        let c = word.charAt(i);
        if (c === '_') {
            i = i + 1;
            if (i >= word.length) {
                return res;
            }
            c = word.charAt(i).toUpperCase();
        }
        res += c;
    }
    return res;
};
