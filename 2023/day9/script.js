const parseInput = () => input.split("\n").map(l => [l.split(' ').map(Number)]);

const diffs = row => row.map((v, i) => v - row[i - 1]).slice(1);

const run = arr => arr.reduce((res, [step], i) => {
    while (step.some(v => v !== 0)) {
        step = diffs(step);
        arr[i].push(step);
    }

    return res + arr[i].reduce((a, v) => a+v.pop(), 0)
}, 0)

console.log('p1', run(parseInput()));
console.log('p2', run(parseInput().map(([row]) => [row.reverse()])));
