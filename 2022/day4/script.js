let a = input.split("\n").map(l => l.split(',').map(i => i.split('-').map(Number)));

console.log(a.filter(e => (e[0][0] >= e[1][0] && e[0][1] <= e[1][1]) || (e[1][0] >= e[0][0] && e[1][1] <= e[0][1]) ).length)
console.log(a.filter(e => !(e[0][1] < e[1][0] || e[1][1] < e[0][0])).length)