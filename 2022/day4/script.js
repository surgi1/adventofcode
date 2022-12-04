let a = input.split("\n").map(l => l.split(',').map(i => i.split('-').map(Number)));

console.log('part 1', a.filter(e => (e[0][0] >= e[1][0] && e[0][1] <= e[1][1]) || (e[1][0] >= e[0][0] && e[1][1] <= e[0][1]) ).length)
console.log('part 2', a.filter(e => !(e[0][1] < e[1][0] || e[1][1] < e[0][0])).length)