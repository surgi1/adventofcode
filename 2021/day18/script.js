const part1 = (tree = new FishTree()) => {
    input.map(l => tree.addArray(l).reduce());
    return tree.magnitude();
}

console.log(part1());
console.log(Math.max(...input.map(i => input.filter(j => i != j).map(j => new FishTree(j).addArray(i).reduce().magnitude())).flat()));