const part1 = (t = new FishTree()) => input.map(t.arm).pop()
const part2 = () => input.map((i,n) => input.filter((j,m) => n-m).map(j => new FishTree(j).arm(i)))

console.log(part1());
console.log(Math.max(...part2().flat()));