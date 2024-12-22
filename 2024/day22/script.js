const init = input => input.split('\n').map(Number);

const next = n => {
    let m = n * 64;
    n = (m ^ n) >>> 0;
    n = n % 16777216;
    let d = Math.floor(n / 32);
    n = (d ^ n) >>> 0;
    n = n % 16777216;
    m = n * 2048;
    n = (m ^ n) >>> 0;
    return n % 16777216;
}

const run1 = (numbers) => numbers.reduce((res, n) => {
    for (let i = 0;i < 2000; i++) n = next(n);
    return res + n;
}, 0)

const run = (numbers, reps = 2000) => {
    const key = arr => arr.join(',');

    let sequences = {};
    numbers.forEach((n, i) => {
        let added = {};
        let lastPrice = n % 10, changes = [];
        for (let j = 0; j < reps; j++) {
            n = next(n);
            let price = n % 10;
            let diff = price - lastPrice;
            changes.push(diff);
            if (changes.length == 4) {
                let k = key(changes);
                if (added[k] === undefined) {
                    if (sequences[k] === undefined) sequences[k] = 0;
                    sequences[k] += price;
                    added[k] = 1;
                }
                changes.shift();
            }
            lastPrice = price;
        }
    })

    return Object.values(sequences).sort((a, b) => b-a)[0];
}

console.log('p1', run1(init(input)))
console.log('p2', run(init(input)))
