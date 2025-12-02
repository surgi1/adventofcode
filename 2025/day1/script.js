const parse = input => input.split("\n").map(line => [line[0], line.match(/\d+/g).map(Number)[0]]);

const simulate = (data, p2 = false, pos = 50) => data.reduce((res, [dir, n]) => {
    for (let i = 0; i < n; i++) {
        if (dir == 'L') pos--; else pos++;
        if ((p2 || (i == n-1)) && (pos % 100 == 0)) res++;
    }
    return res;
}, 0)

const computeP1 = (data, pos = 50) => data.reduce((res, [dir, n]) => {
    if (dir == 'L') {
        pos -= n;
        let wraps = Math.abs(Math.floor(pos / 100));
        pos += wraps * 100;
    } else pos += n;

    pos %= 100;
    if (pos == 0) res++;

    return res;
}, 0)

const computeP2 = (data, pos = 50) => data.reduce((res, [dir, n]) => {
    if (dir == 'L') {
        if (pos == 0) res--; // starting at pos = 0, we would end up 1 tick above
        pos -= n;
        let wraps = Math.abs(Math.floor(pos / 100));
        pos += wraps * 100;
        res += wraps;
        if (pos == 0) res++;
    } else pos += n;

    res += Math.floor(pos / 100);
    pos %= 100;

    return res;
}, 0)

console.log('simulated p1', simulate(parse(input)));
console.log('simulated p2', simulate(parse(input), true));
console.log('computed p1', computeP1(parse(input)));
console.log('computed p2', computeP2(parse(input)));
