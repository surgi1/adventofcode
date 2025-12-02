const parse = input => input.split(",").map(s => s.split('-').map(Number));

const run = (data) => data.reduce((res, [from, to]) => {
    for (let id = from; id <= to; id++) {
        let s = ''+id;
        if (s.length % 2 == 1) continue;
        if (s.substr(0, s.length/2) == s.substr(s.length/2)) res += id;
    }
    return res;
}, 0)

const run2 = (data) => data.reduce((res, [from, to]) => {
    for (let id = from; id <= to; id++) {
        let s = ''+id;
        for (let i = 1; i <= s.length/2; i++) {
            if (s.length % i !== 0) continue;
            if (s.substr(0, i).repeat(s.length/i) == s) {
                res += id;
                break;
            }
        }
    }
    return res;
}, 0)

console.log('p1', run(parse(input)));
console.log('p2', run2(parse(input)));
