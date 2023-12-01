const literals = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
}

const matchOverlap = (input, reg) => {
    let res = [], m;
    while (m = reg.exec(input)) {
        reg.lastIndex -= m[0].length - 1;
        res.push(m[0]);
    }
    return res;
}

const findDigits = (v, reg, replaceLiterals = false) => matchOverlap(v, reg).map(e => literals[e] !== undefined ? literals[e] + '' : e);

const run = replaceLiterals => {
    let reg = new RegExp("\\d" + (replaceLiterals ? '|' + Object.keys(literals).join('|') : ''), 'g');
    return input.split("\n").map(v => findDigits(v, reg, replaceLiterals)).map(p => Number(p[0] + p.pop())).reduce((sum, v, i) => sum+v, 0);
}

console.log('p1', run(false));
console.log('p2', run(true));
