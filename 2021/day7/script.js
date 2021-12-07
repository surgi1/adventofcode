const parseInput = input => input.split(",").map(n => parseInt(n));
const alignCrabs = (progressive = false) => {
    const energyDist = (d, res = 0) => progressive ? d*(d+1)/2 : d;
    let crabs = parseInput(input), max = Math.max(...crabs), res = Number.MAX_SAFE_INTEGER;
    for (let d = 1; d < max; d++) res = Math.min(res, crabs.reduce((a, c) => a+energyDist(Math.abs(c-d)), 0))
    return res;
}

console.log(alignCrabs()); // aligned to median height
console.log(alignCrabs(true));