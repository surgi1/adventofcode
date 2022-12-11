const parseInput = (monkeys = []) => {
    input.split("\n\n").map(data => {
        let monLit = data.split("\n"), tmp = {ins: 0, targets: [4, 5]};
        tmp.stack = monLit[1].match(/\d+/g).map(Number);
        tmp.mod = Number(monLit[3].match(/\d+/));
        tmp.targets = tmp.targets.map(lineId => Number(monLit[lineId].match(/\d+/)));
        tmp.opLit = monLit[2].split(' ').slice(-3);
        monkeys.push(tmp)
    })
    return monkeys;
}

const compute = (part2 = false, rounds = part2 ? 10000 : 20) => {
    const val = (v, old) => isNaN(v) ? old : Number(v);
    const op = (old, opLit) => opLit[1] == '+' ? val(opLit[0], old)+val(opLit[2], old) : val(opLit[0], old)*val(opLit[2], old)

    const round = () => {
        for (let i = 0; i < monkeys.length; i++) {
            while (monkeys[i].stack.length) {
                let item = monkeys[i].stack.shift();
                
                if (!part2) {
                    item = Math.floor((op(item, monkeys[i].opLit) % mod) / 3); // p1
                } else {
                    item = op(item, monkeys[i].opLit) % mod; // p2
                }

                let targetId = monkeys[i].targets[ Math.sign(item % monkeys[i].mod) ]
                monkeys[targetId].stack.push(item);
                monkeys[i].ins++;
            }
        }
    }

    let monkeys = parseInput();
    let mod = monkeys.reduce((a, c) => a*c.mod, 1);

    while (rounds--) round();

    return monkeys.sort((a,b) => b.ins-a.ins).slice(0,2).reduce((a,c) => a*c.ins, 1);

}

console.log(compute());
console.log(compute(true));