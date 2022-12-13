const arrayCmp = (a, b) => {
    if (!Array.isArray(a) && !Array.isArray(b)) {
        if (a == b) return;
        return a < b;
    }

    if (Array.isArray(a) && Array.isArray(b)) {
        for (let i = 0; i < Math.min(a.length, b.length); i++) {
            let subRes = arrayCmp(a[i], b[i])
            if (subRes != null) return subRes;
        }
        return arrayCmp(a.length, b.length);
    }

    if (Array.isArray(a) && !Array.isArray(b)) return arrayCmp(a, [b]);
    return arrayCmp([a], b);
}

let items = [], extraItems = [[[2]], [[6]]];

const part1 = () => input.split("\n\n").reduce((res, rp, id) => {
    let tmp = rp.split("\n");
    let a = JSON.parse(tmp[0]), b = JSON.parse(tmp[1]);
    items.push(a, b);
    return res + (arrayCmp(a, b) ? id+1 : 0);
}, 0)

const part2 = () => [...items, ...extraItems]
        .sort((a, b) => arrayCmp(b, a) - arrayCmp(a, b))
        .reduce((a, v, i) => (extraItems.includes(v) ? a*(i+1) : a), 1)


console.log(part1());
console.log(part2());