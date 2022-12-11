const parseInput = (monkeys = []) => {
    input.split("\n\n").map(data => {
        let monLit = data.split("\n"), tmp = {ins: 0, targets: [4, 5]};
        tmp.stack = monLit[1].match(/\d+/g).map(Number);
        tmp.mod = Number(monLit[3].match(/\d+/));
        tmp.targets = tmp.targets.map(lineId => Number(monLit[lineId].match(/\d+/)));
        tmp.opPars = monLit[2].split(' ').slice(-3);
        monkeys.push(tmp);
    })
    return monkeys;
}

const compute = (part2 = false, rounds = part2 ? 10000 : 20) => {
    const val = (v, old) => isNaN(v) ? old : Number(v);
    const op = (old, pars) => pars[1] == '+' ? val(pars[0], old)+val(pars[2], old)
                                             : val(pars[0], old)*val(pars[2], old)

    const round = () => {
        monkeys.forEach(monkey => {
            while (monkey.stack.length) {
                let item = monkey.stack.shift();
                
                if (!part2)
                    item = Math.floor((op(item, monkey.opPars) % mod) / 3);
                else
                    item = op(item, monkey.opPars) % mod;

                let targetId = monkey.targets[ Math.sign(item % monkey.mod) ]
                monkeys[targetId].stack.push(item);
                monkey.ins++;
            }
        })
    }

    let monkeys = parseInput();
    let mod = monkeys.reduce((a, c) => a*c.mod, 1);

    while (rounds--) round();
    return monkeys.sort((a,b) => b.ins-a.ins).slice(0,2).reduce((a,c) => a*c.ins, 1);
}

console.log(compute());
console.log(compute(true));