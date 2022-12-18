let cubes = input.split("\n").map(line => line.split(',').map(Number)),
    water = [], processed = new Set(), cubeSet = new Set(),
    max = [0,0,0], min = [20,20,20];

const dirs = [[1,0,0], [-1,0,0], [0,1,0], [0,-1,0], [0,0,1], [0,0,-1]];
const k = cube => cube.join('_')
const inRange = cube => cube.every((v, i) => v >= min[i] && v <= max[i]);
const addCube = (c1, c2) => c1.map((v, i) => v+c2[i]);
const cubeDist = (c1, c2) => c1.reduce((a, v, i) => a+Math.abs(v-c2[i]), 0);

console.log(cubes.reduce((acc, c1) => {
    cubeSet.add(k(c1));
    max = max.map((v, d) => Math.max(v, c1[d]+1));
    min = min.map((v, d) => Math.min(v, c1[d]-1));
    return acc + 6 - cubes.filter(c2 => cubeDist(c1, c2) == 1).length
}, 0)); // part 1

// for part 2, we need to spread the water cubes
const spread = cube => {
    if (processed.has(k(cube))) return;
    processed.add(k(cube));
    water.push(cube);
    // and spread
    for (let i = 0; i < dirs.length; i++) {
        let targetCube = addCube(cube, dirs[i]);
        if (inRange(targetCube) && !cubeSet.has(k(targetCube))) spread(targetCube);
    }
}

spread(min);

// now all the water cubes sides that are touching normal cube
console.log(water.reduce((acc, c1) => acc+cubes.filter(c2 => cubeDist(c1, c2) == 1).length, 0));
