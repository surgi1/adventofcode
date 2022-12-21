let monkeys = {}, notConst = new Set();

input.split("\n").map(line => {
    let tmp = line.split(' ');
    let k = tmp[0].substr(0,4);
    if (tmp.length == 2) monkeys[k] = Number(tmp[1])
        else monkeys[k] = tmp.slice(-3);
})

const compute = (m, monkeys, part2 = true, res = 0) => {
    if (!isNaN(monkeys[m])) return monkeys[m];

    if (m == 'root' && part2) res = compute(monkeys[m][0], monkeys) == compute(monkeys[m][2], monkeys); else {
        if (monkeys[m][1] == '+') res = compute(monkeys[m][0], monkeys)+compute(monkeys[m][2], monkeys);
        if (monkeys[m][1] == '-') res = compute(monkeys[m][0], monkeys)-compute(monkeys[m][2], monkeys);
        if (monkeys[m][1] == '*') res = compute(monkeys[m][0], monkeys)*compute(monkeys[m][2], monkeys);
        if (monkeys[m][1] == '/') res = compute(monkeys[m][0], monkeys)/compute(monkeys[m][2], monkeys);
    }

    if (!notConst.has(m)) monkeys[m] = res;
    return res;
}

const parenthe = v => v.match(/[\+\-\*\\=]/) ? '('+v+')' : v;

const print = (m, monkeys, res = '') => {
    if (m == 'humn') return 'x'; // so wolfram alpha catches up
    if (notConst.has(m) && m != 'root' && !isNaN(monkeys[m])) return m;

    if (!isNaN(monkeys[m])) return monkeys[m]+'';

    if (m == 'root') res = parenthe(print(monkeys[m][0], monkeys))+'='+parenthe(print(monkeys[m][2], monkeys)); else {
        if (monkeys[m][1] == '+') res = parenthe(print(monkeys[m][0], monkeys))+'+'+parenthe(print(monkeys[m][2], monkeys));
        if (monkeys[m][1] == '-') res = parenthe(print(monkeys[m][0], monkeys))+'-'+parenthe(print(monkeys[m][2], monkeys));
        if (monkeys[m][1] == '*') res = parenthe(print(monkeys[m][0], monkeys))+'*'+parenthe(print(monkeys[m][2], monkeys));
        if (monkeys[m][1] == '/') res = parenthe(print(monkeys[m][0], monkeys))+'/'+parenthe(print(monkeys[m][2], monkeys));
    }
    return res;
}

const findNotConst = monkeys => {
    let m1 = {...monkeys}, m2 = {...monkeys}

    compute('root', m1);
    m2.humn++;
    compute('root', m2);

    Object.keys(m1).filter(k => m1[k] != m2[k]).map(k => notConst.add(k));
    notConst.add('root');
}

const part2 = monkeys => {
    findNotConst(monkeys);
    compute('root', monkeys);
    console.log('part 2: Paste the following to Wolfram Alpha or solve by hand!')
    console.log(print('root', monkeys));
}

console.log('part 1', compute('root', {...monkeys}, false));
part2({...monkeys});