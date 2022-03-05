const part1 = (t = new FishTree()) => input.map(l => t.addArray(l).reduce().magnitude()).pop()
const part2 = () => input.map((i,n) => input.filter((j,m) => n != m).map(j => new FishTree(j).addArray(i).reduce().magnitude()))

console.log(part1());
console.log(Math.max(...part2().flat()));