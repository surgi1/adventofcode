const getVars = () => {
    let variables = [];
    while (true) {
        try {
            input(() => {});
            break;
        } catch (e) {
            let v = e.message.split(' ')[0];
            variables.push(v);
            window[v] = 0;
        }
    }
    return variables;
}

let regs = getVars();
let max = 0;

const maxVal = () => {
    let values = [];
    regs.map(reg => values.push(window[reg]));
    let res = Math.max(...values);
    max = Math.max(res, max);
    return res;
}

regs.map(reg => window[reg] = 0);
input(() => {
    max = Math.max(max, maxVal())
});

console.log('part 1', maxVal());
console.log('part 2', max);
