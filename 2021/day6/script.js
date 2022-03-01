const run = (rounds, counts = Array(9).fill(0)) => {
    input.split(',').map(t => counts[Number(t)]++);

    while (rounds--) {
        let former0 = counts.shift();
        counts[6] += former0;
        counts[8] = former0;
    };

    return counts.reduce((a, c) => a+c);
}

console.log(run(80));
console.log(run(256));