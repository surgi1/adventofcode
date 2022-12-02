let a = input.split("\n\n")
             .map(e => e.split("\n")
                        .map(Number)
                        .reduce((a, c) => a+c, 0))
             .sort((a, b) => b-a);

console.log('part 1', a[0]);
console.log('part 2', a[0]+a[1]+a[2]);
