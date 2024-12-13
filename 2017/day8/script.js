const maxVal = () => Math.max(...regs.map(r => window[r]))
const getVars = (variables = []) => {
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

let regs = getVars(), max = 0;

regs.map(reg => window[reg] = 0);
input(() => max = Math.max(max, maxVal()));

console.log('part 1', maxVal());
console.log('part 2', max);
