const volume = bounds => Math.abs(bounds[1]-bounds[0])*Math.abs(bounds[3]-bounds[2])*Math.abs(bounds[5]-bounds[4])
const regionIntersect = (r1, r2) => r2[0] <= r1[1] && r2[1] >= r1[0] && r2[2] <= r1[3] && r2[3] >= r1[2] && r2[4] <= r1[5] && r2[5] >= r1[4]

const parseInput = data => {
    let steps = [];
    data.map(line => {
        let tmp = line.split(' ');
        steps.push({
            command: tmp[0] == 'on' ? 1 : 0,
            bounds: tmp[1].match(/(-)*\d+/g).map(n => parseInt(n))
        })
    })
    return steps.reverse();
}

const part1 = (steps, sum = 0) => {
    const getCubeState = (x,y,z, res = 0) => {
        steps.some(step => {
            if (regionIntersect(step.bounds, [x, x, y, y, z, z])) {
                res = step.command;
                return true;
            }
        })
        return res;
    }
    for (let x = -50;x <= 50; x++) for (let y = -50;y <= 50; y++) for (let z = -50;z <= 50; z++) sum += getCubeState(x,y,z);
    return sum;
}

const intersectionWithRegionsVolume = (reg, regions) => regions.map((r, i) => {
    if (!regionIntersect(reg, r)) return 0;
    let tmpBounds = [Math.max(reg[0], r[0]), Math.min(reg[1], r[1]),
                     Math.max(reg[2], r[2]), Math.min(reg[3], r[3]),
                     Math.max(reg[4], r[4]), Math.min(reg[5], r[5])];
    return volume(tmpBounds) - intersectionWithRegionsVolume(tmpBounds, regions.slice(i+1))
}).reduce((acc, b) => acc+b, 0)

const part2 = (steps, sum = 0, regions = []) => {
    steps.forEach(step => {
        let tmp = step.bounds.slice();
        if (step.command == 1) sum += volume(tmp)-intersectionWithRegionsVolume(tmp, regions);
        regions.push(tmp);
    })
    return sum;
}

console.log(part1(parseInput(input)));
console.log(part2(parseInput(input)));
