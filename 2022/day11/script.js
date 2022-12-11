const parseInput = () => input.split("\n\n").map(data => {
    let tmp = data.split("\n");
    return {
        ins: 0,
        stack: tmp[1].match(/\d+/g).map(Number),
        mod: Number(tmp[3].match(/\d+/)),
        targets: [4, 5].map(lNr => Number(tmp[lNr].match(/\d+/))),
        opPars: tmp[2].split(' ').slice(-3)
    }
})

const compute = (part2 = false, rounds) => {
    const val = (v, old) => isNaN(v) ? old : Number(v);
    const op = (old, pars) => pars[1] == '+' ? val(pars[0], old)+val(pars[2], old)
                                             : val(pars[0], old)*val(pars[2], old)
    const round = () => monkeys.forEach(monkey => {
        while (monkey.stack.length) {
            let item = monkey.stack.shift();
            item = part2 ? op(item, monkey.opPars) % mod
                         : Math.floor((op(item, monkey.opPars) % mod) / 3)
            monkeys[monkey.targets[Math.sign(item % monkey.mod)]].stack.push(item);
            monkey.ins++;
        }
    })

    let monkeys = parseInput();
    let mod = monkeys.reduce((a, c) => a*c.mod, 1);

    while (rounds--) round();
    return monkeys.sort((a,b) => b.ins-a.ins).slice(0,2).reduce((a,c) => a*c.ins, 1);
}

console.log(compute(false, 20));
console.log(compute(true, 10000));