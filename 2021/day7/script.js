const parseInput = input => input.split(",").map(n => parseInt(n));
const alignCrabs = (progressive = false) => {
    const energyDist = (d, res = 0) => {
        if (!progressive) return d;
        while (d) {res += d; d--}
        return res;
    }
    let crabs = parseInput(input), lookupTable = [0], max = Math.max(...crabs), res = Number.MAX_SAFE_INTEGER;
    for (let d = 1; d < max; d++) lookupTable[d] = energyDist(d);
    for (let d = 1; d < max; d++) res = Math.min(res, crabs.reduce((a, c) => a+lookupTable[Math.abs(c-d)], 0))
    return res;
}

console.log(alignCrabs()); // aligned to median height
console.log(alignCrabs(true));