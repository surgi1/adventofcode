const part1 = (tree = new FishTree()) => {
    input.map(l => tree.addArray(l).reduce());
    return tree.magnitude();
}

const part2 = () => Math.max(...input.map(i => input.filter(j => i != j).map(j => new FishTree(j).addArray(i).reduce().magnitude())).flat())

console.log('magnitude', part1());
console.log('largest magnitude', part2());