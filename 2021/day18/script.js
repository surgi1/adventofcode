const part1 = () => {
    let tree = new FishTree(input[0]);
    tree.reduce();
    for (let i = 1; i < input.length; i++) {
        tree.addArray(input[i]);
        tree.reduce();
    }
    console.log('reduced', tree.print());
    console.log('magnitude', tree.magnitude());
}

const part2 = (maxMag = 0) => {
    for (let j = 0; j < input.length; j++) for (let i = 0; i < input.length; i++) {
        if (i == j) continue;
        let tree = new FishTree(input[j]);
        tree.reduce();
        tree.addArray(input[i]);
        tree.reduce();
        maxMag = Math.max(maxMag, tree.magnitude());
    }
    console.log('largest magnitude', maxMag);
}

part1(); // pretty slow
part2();