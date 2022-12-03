const compute = len => input.split("\n\n")
            .map(e => e.split("\n").map(Number).reduce((a, c) => a+c, 0))
            .sort((a, b) => b-a).slice(0, len).reduce((a, c) => a+c, 0);

console.log('part 1', compute(1));
console.log('part 2', compute(3));
