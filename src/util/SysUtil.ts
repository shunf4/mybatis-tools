export const sleep = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};


export const underlineToHump = (word: string) => {
    let res = '';
    for (let i = 0; i < word.length; i++) {
        let c = word.charAt(i);
        if (c === '_') {
            i++;
            c = word.charAt(i).toUpperCase();
        }
        res += c;
    }
    return res;
};
