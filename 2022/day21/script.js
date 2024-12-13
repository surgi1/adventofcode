let monkeys = {}, notConst = new Set(['root']);

input.split("\n").map(line => {
    let tmp = line.split(' ');
    monkeys[tmp[0].substr(0,4)] = tmp.length == 2 ? Number(tmp[1]) : tmp.slice(-3);
})

const compute = (m, monkeys, part2 = true, res = 0) => {
    if (!isNaN(monkeys[m])) return monkeys[m];

    if (m == 'root' && part2) {
        res = compute(monkeys[m][0], monkeys) == compute(monkeys[m][2], monkeys);
    } else {
        if (monkeys[m][1] == '+') res = compute(monkeys[m][0], monkeys)+compute(monkeys[m][2], monkeys);
        if (monkeys[m][1] == '-') res = compute(monkeys[m][0], monkeys)-compute(monkeys[m][2], monkeys);
        if (monkeys[m][1] == '*') res = compute(monkeys[m][0], monkeys)*compute(monkeys[m][2], monkeys);
        if (monkeys[m][1] == '/') res = compute(monkeys[m][0], monkeys)/compute(monkeys[m][2], monkeys);
    }

    if (!notConst.has(m)) monkeys[m] = res;
    return res;
}

const findNotConst = monkeys => {
    let m1 = {...monkeys}, m2 = {...monkeys}

    compute('root', m1);
    m2.humn += 139; // random number, we just need the humn to change
    compute('root', m2);

    Object.keys(m1).filter(k => m1[k] != m2[k]).map(k => notConst.add(k));
}

const part2 = monkeys => {
    findNotConst(monkeys);
    compute('root', monkeys);

    monkeys.humn = 'humn';
    let res, n;
    if (isNaN(monkeys[monkeys.root[0]])) {
        res = monkeys[monkeys.root[2]];
        n = monkeys[monkeys.root[0]];
    } else {
        res = monkeys[monkeys.root[0]];
        n = monkeys[monkeys.root[2]];
    }

    while (n != 'humn') {
        if (isNaN(monkeys[n[0]])) {
            if (n[1] == '+') res = res - monkeys[n[2]];
            if (n[1] == '-') res = res + monkeys[n[2]];
            if (n[1] == '*') res = res / monkeys[n[2]];
            if (n[1] == '/') res = res * monkeys[n[2]];
            n = monkeys[n[0]];
        } else {
            if (n[1] == '+') res = res - monkeys[n[0]];
            if (n[1] == '-') res = -(res - monkeys[n[0]]);
            if (n[1] == '*') res = res / monkeys[n[0]];
            if (n[1] == '/') res = 1/(res / monkeys[n[0]]);
            n = monkeys[n[2]]
        }
    }

    return res;
}

console.log('part 1', compute('root', {...monkeys}, false));
console.log('part 2', part2({...monkeys}));