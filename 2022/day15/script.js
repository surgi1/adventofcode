// p2 is pretty slow (~15s)
const p1y = 2000000, min = 0, max = 4000000;
let data = [];

const dist = (a, b) => Math.abs(a.x-b.x)+Math.abs(a.y-b.y)
const volume = bounds => Math.abs(bounds[1]-bounds[0])
const regionIntersect = (r1, r2) => r2[0] <= r1[1] && r2[1] >= r1[0]
const blindsOnRow = y => max-intersectionWithRegionsVolume([min, max], getIntervals(y))

const getIntervals = (y, intervals = []) => {
    data.forEach(dat => {
        let spareX = dat.d-Math.abs(dat.sensor.y-y);
        if (spareX >= 0) intervals.push([dat.sensor.x-spareX, dat.sensor.x+spareX])
    })
    return intervals;
}

const intersectionWithRegionsVolume = (reg, regions) => regions.map((r, i) => {
    if (!regionIntersect(reg, r)) return 0;
    let tmpBounds = [Math.max(reg[0], r[0]), Math.min(reg[1], r[1])];
    return volume(tmpBounds) - intersectionWithRegionsVolume(tmpBounds, regions.slice(i+1))
}).reduce((acc, b) => acc+b, 0)

const part1 = (sum = 0, regions = []) => {
    getIntervals(p1y).forEach(step => {
        let tmp = step.slice();
        sum += volume(tmp)-intersectionWithRegionsVolume(tmp, regions);
        regions.push(tmp);
    })
    return sum;
}

const part2 = (p2y = 0) => {
    while (!blindsOnRow(p2y)) p2y++;
    let intervals = getIntervals(p2y);
    for (let x = min; x <= max; x++)
        if (intervals.every(i => i[0] > x || i[1] < x)) return x*max+p2y;
}

input.split("\n").map(line => {
    let tmp = line.match(/-?\d+/g).map(Number)
    data.push({
        sensor: {x: tmp[0], y: tmp[1]},
        beacon: {x: tmp[2], y: tmp[3]},
        d: dist({x: tmp[0], y: tmp[1]}, {x: tmp[2], y: tmp[3]})
    })
});

console.log(part1())
console.log(part2());