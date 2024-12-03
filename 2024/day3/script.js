const run = input => input.match(/mul\(\d+,\d+\)/g).reduce((res, cmd) => res + cmd.match(/\d+/g).map(Number).reduce((a, v) => a*v, 1), 0)

const p2 = (input, mult = 1) => input.match(/don't\(\)|do\(\)|(mul\(\d+,\d+\))/g).reduce((res, cmd) => {
    if (cmd == 'don\'t()') {mult = 0; return res}
    if (cmd == 'do()') {mult = 1; return res}
    return res + (mult ? run(cmd, mult) : 0)
}, 0)

console.log('p1', run(input));
console.log('p2', p2(input));
