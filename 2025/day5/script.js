const parse = input => {
    let [ranges, ingredients] = input.split('\n\n');
    return [ranges.split('\n').map(line => line.split('-').map(Number)), ingredients.split('\n').map(Number)]
}

const run = ([ranges, ingredients]) => ingredients.filter(n => ranges.some(([from, to]) => n >= from && n <= to)).length

const volume = bounds => Math.abs(bounds[1]-bounds[0]) + 1;

const regionIntersect = (r1, r2) => r2[0] <= r1[1] && r2[1] >= r1[0];

const intersectionWithRegionsVolume = (reg, regions) => regions.map((r, i) => {
    if (!regionIntersect(reg, r)) return 0;
    let tmpBounds = [Math.max(reg[0], r[0]), Math.min(reg[1], r[1])];
    return volume(tmpBounds) - intersectionWithRegionsVolume(tmpBounds, regions.slice(i+1))
}).reduce((acc, b) => acc+b, 0)

const run2 = ([ranges, ingredients]) => {
    let min = Math.min(...ranges.map(r => r[0]));
    let max = Math.max(...ranges.map(r => r[1]));

    return intersectionWithRegionsVolume([min, max], ranges);
}

console.log('p1', run(parse(input)));
console.log('p2', run2(parse(input)));
