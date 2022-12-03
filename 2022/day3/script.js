const string2Set = s => new Set(s.split(''))
const getCode = l => l === l.toLowerCase() ? l.charCodeAt(0)-96: l.charCodeAt(0)-38;

const part1 = (res = 0) => {
    input.split("\n").forEach(row => {
        let h1 = string2Set(row.substring(0, row.length/2)),
            h2 = string2Set(row.substring(row.length/2));
        for (k of h1)
            if (h2.has(k)) { res += getCode(k); break; }
    })
    return res;
}

const part2 = (res = 0) => {
    let elves = input.split("\n").map(string2Set);
    for (let i = 0; i < elves.length; i += 3)
        for (k of elves[i])
            if (elves[i+1].has(k) && elves[i+2].has(k)) { res += getCode(k); break; }
    return res;
}

console.log('part 1', part1());
console.log('part 2', part2());