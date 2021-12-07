const parseInput = input => input.split(",").map(n => parseInt(n));
const run = rounds => {
    let timers = parseInput(input), counts = Array(10).fill(0);
    timers.map(t => counts[t]++);

    const tick = () => {
        let former0 = counts[0];
        for (let i = 1; i <= 8; i++) counts[i-1] = counts[i];
        counts[6] += former0;
        counts[8] = former0;
    }

    for (let rnd = 0; rnd < rounds; rnd++) tick();
    return counts.reduce((a, c) => a+c, 0);
}

console.log(run(80));
console.log(run(256));