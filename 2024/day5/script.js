const initSection = (s, sep) => s.split("\n").map(line => line.split(sep).map(Number));
const init = input => {
    let [sortLit, linesLit] = input.split("\n\n");
    return [initSection(sortLit, '|'), initSection(linesLit, ',')]
}

const run = ([sorts, lines], cmpFnc = (a, b) => a == b) => lines.reduce((res, line) => {
    let prevState = line.join(',');
    line.sort((a, b) => {
        let rule = sorts.filter(r => (r[0] == a && r[1] == b) || (r[0] == b && r[1] == a));
        return rule.length == 0 ? 0 : (rule[0][0] == a ? -1 : 1);
    })
    return res + (cmpFnc(line.join(','), prevState) ? line[Math.floor(line.length/2)] : 0);
}, 0)

console.log('p1', run(init(input)));
console.log('p2', run(init(input), (a, b) => a != b));
