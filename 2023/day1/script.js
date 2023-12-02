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

const run = replaceLiterals => {
    let reg = new RegExp('\\d' + (replaceLiterals ? '|' + Object.keys(literals).join('|') : ''), 'g');
    return input.split("\n").map(v => matchOverlap(v, reg).map(e => literals[e] || e))
                            .map(p => 10*p[0] + 1*p.pop())
                            .reduce((a, v, i) => a+v, 0);
}

console.log('p1', run(false));
console.log('p2', run(true));
