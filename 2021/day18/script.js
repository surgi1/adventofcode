const part1 = (t = new FishTree()) => input.map(l => t.addArray(l).reduce().magnitude()).pop()

console.log(part1());
console.log(Math.max(...input.map(i => input.filter(j => i != j).map(j => new FishTree(j).addArray(i).reduce().magnitude())).flat()));