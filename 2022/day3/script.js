const string2Map = s =>  new Map(s.split('').map(i => [i,i]))
const getCode = l => {
    if (l == l.toLowerCase()) return l.charCodeAt(0)-96;
    return l.charCodeAt(0)-38;
}

const part1 = (res = 0) => {
    input.split("\n").forEach(row => {
        let h1 = string2Map(row.substring(0, row.length/2)),
            h2 = string2Map(row.substring(row.length/2));
        for ([k, v] of h1)
            if (h2.has(k)) { res += getCode(k); break; }
    })
    return res;
}

const part2 = (res = 0) => {
    let elves = input.split("\n").map(string2Map);
    for (let i = 0; i < elves.length; i += 3)
        for ([k, v] of elves[i])
            if (elves[i+1].has(k) && elves[i+2].has(k)) { res += getCode(k); break; }
    return res;
}

console.log('part 1', part1());
console.log('part 2', part2());