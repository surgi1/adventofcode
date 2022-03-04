const alignCrabs = (progressive = false) => {
    const dist = d => progressive ? d*(d+1)/2 : d
    let crabs = input.split(',').map(Number), max = Math.max(...crabs), res = Number.MAX_SAFE_INTEGER;
    while (max--) res = Math.min(res, crabs.reduce((a, c) => a+dist(Math.abs(c-max)), 0))
    return res;
}

console.log(alignCrabs()); // aligned to median height
console.log(alignCrabs(true));