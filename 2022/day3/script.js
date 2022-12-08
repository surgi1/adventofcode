const getCode = c => c === c.toLowerCase() ? c.charCodeAt(0)-96: c.charCodeAt(0)-38;

const part1 = () => input.split("\n").reduce((res, l) => {
    let h1 = new Set([...l].slice(0, l.length/2)),
        h2 = new Set([...l].slice(l.length/2));
    for (k of h1)
        if (h2.has(k)) return res + getCode(k)
}, 0)

const part2 = (res = 0) => {
    let elves = input.split("\n").map(s => new Set([...s]));
    for (let i = 0; i < elves.length; i += 3)
        for (k of elves[i])
            if (elves[i+1].has(k) && elves[i+2].has(k)) { res += getCode(k); break; }
    return res;
}

console.log(part1());
console.log(part2());