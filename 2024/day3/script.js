const run = s => s.match(/mul\(\d+,\d+\)/g).reduce((res, cmd) => res + cmd.match(/\d+/g).reduce((a, v) => a*v, 1), 0)

const p2 = (input, gate = 1) => input.match(/don't\(\)|do\(\)|mul\(\d+,\d+\)/g).reduce((res, cmd) => {
    if (cmd == "don't()") {gate = 0; return res}
    if (cmd == "do()") {gate = 1; return res}
    return res + (gate ? run(cmd) : 0)
}, 0)

console.log('p1', run(input));
console.log('p2', p2(input));
