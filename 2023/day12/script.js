let arr = input.split("\n").map(row => {
    let tmp = row.split(' ');
    return [tmp[0], tmp[1].split(',').map(Number)];
});

let memo = {};

const count = (map, sizes) => {
    if (map.length === 0) return sizes.length === 0 ? 1 : 0;

    if (sizes.length === 0) return map.includes('#') ? 0 : 1;

    let k = [map, ...sizes].join('_');

    if (k in memo) return memo[k];

    let res = 0;

    if (['.', '?'].includes(map[0])) {
        res += count(map.slice(1), sizes);
    }

    if (['#', '?'].includes(map[0])) {
        if (map.length >= sizes[0] && !map.slice(0, sizes[0]).includes('.') && (map.length === sizes[0] || map[sizes[0]] !== '#')) {
            res += count(map.slice(sizes[0] + 1), sizes.slice(1));
        }
    }

    memo[k] = res;
    return res;
}

const run = (copies = 1) => arr.reduce((res, line) => {
    let [map, sizes] = [line[0], line[1]];

    map = Array(copies).fill(map).join('?');
    sizes = Array(copies).fill(sizes).flat();

    return res + count(map, sizes);
}, 0)

console.log('p1', run());
console.log('p2', run(5));
