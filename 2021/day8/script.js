const sevenSeg2Num = ['1110111', '0010010', '1011101', '1011011', '0111010', '1101011', '1101111', '1010010', '1111111', '1111011']
const parseInput = input => input.map(line => line.split('|').map(l => l.split(' ')))
const byLen = (line, len) => [...line[0], ...line[1]].filter(e => e.length == len)
const strDiff = (s1, s2) => [].concat(s1.split(''), s2.split('')).reduce((diff, l) => diff += (!s1.includes(l) || !s2.includes(l)) ? l : '', '')
const strContains = (s1, s2) => s2.split('').reduce((diff, l) => diff += (!s1.includes(l)) ? l : '', '') == ''
const strCommon = (s1, s2) => s2.split('').reduce((common, l) => common += (s1.includes(l)) ? l : '', '')
const part1 = data => data.reduce((acc, d) => acc + d[1].filter(e => [2, 3, 4, 7].includes(e.length)).length, 0)
const part2 = data => data.reduce((acc, item) => acc + parseInt(item[1].reduce((s, n) => s+seg2Num(n, deduceSeg(item)) , '')), 0)

const deduceSeg = line => {
    /* 000
      1   2
       333
      4   5
       666  */
    let seg = Array(7), nr7 = byLen(line, 3)[0], nr1 = byLen(line, 2)[0], nr4 = byLen(line, 4)[0];
    seg[0] = strDiff(nr1, nr7);
    let sgm13 = strDiff(nr4, nr1), sgm46 = strDiff('abcdefg', seg[0]+nr1+sgm13), sgm36 = strDiff(byLen(line, 5).filter(s => strContains(s, nr7))[0], nr7);
    seg[6] = strCommon(sgm46, sgm36);
    seg[4] = strDiff(seg[6], sgm46);
    seg[3] = strDiff(seg[6], sgm36);
    seg[1] = strDiff('abcdefg', seg.reduce((a,c) => a+c, '')+nr1);
    seg[5] = strDiff(byLen(line, 5).filter(s => strContains(s, seg[1]))[0], seg[0]+seg[1]+seg[3]+seg[6]);
    seg[2] = strDiff(nr1, seg[5]);
    return seg;
}

const seg2Num = (on, map, display = Array(7).fill(0)) => {
    on.split('').map(l => display[map.indexOf(l)] = 1)
    return sevenSeg2Num.indexOf(display.join(''))
}

let data = parseInput(input);

console.log(part1(data));
console.log(part2(data));