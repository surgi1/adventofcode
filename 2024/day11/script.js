const init = input => input.split(' ').map(Number)

let memo = {};

const blink = (v, nr = 0, target = 25) => {
    if (nr == target) return 1;

    let k = v+'_'+nr,
        ret;

    if (memo[k] !== undefined) return memo[k];

    if (v == 0) {
        ret = blink(1, nr+1, target);
    } else {
        let s = ''+v;
        if (s.length % 2 == 0) {
            ret = blink(Number(s.slice(0, (s.length/2))), nr+1, target) + blink(Number(s.slice(s.length/2)), nr+1, target);
        } else {
            ret = blink(v*2024, nr+1, target);
        }
    }

    memo[k] = ret;
    return ret;
}

const run = (data, blinks = 25) => data.reduce((a, v) => a + blink(v, 0, blinks), 0)

console.log('p1', run(init(input)));
memo = {};
console.log('p2', run(init(input), 75));
