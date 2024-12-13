let data = input.split('\n').map(line => {
    let tmp = line.split('] ');
    return {
        ts: new Date(tmp[0].substr(1)).getTime(),
        minute: Number(tmp[0].substr(-2)),
        msg: tmp[1],
        guardId: tmp[1].includes('Guard') ? Number(tmp[1].match(/\d+/)) : undefined
    }
}).sort((a, b) => a.ts - b.ts);

let guards = [], guardId, from;

data.forEach(v => {
    if (v.guardId !== undefined) guardId = v.guardId;
    if (v.msg === 'falls asleep') from = v.minute;
    if (v.msg === 'wakes up') {
        if (guards.filter(o => o.id === guardId).length === 0) guards.push({
            id: guardId,
            mins: [],
            total: 0
        })
        let g = guards.filter(o => o.id === guardId)[0];
        for (let m = from; m < v.minute; m++) {
            if (g.mins.filter(minO => minO.id === m).length === 0) g.mins.push({
                id: m,
                i: 0
            })
            let mo = g.mins.filter(minO => minO.id === m)[0];
            mo.i++;
            g.total++;
        }
    }
})

guards.sort((a, b) => b.total - a.total)

guards.forEach(g => g.mins.sort((a, b) => b.i - a.i))

console.log('p1', guards[0].id * guards[0].mins[0].id);

guards.sort((a, b) => b.mins[0].i - a.mins[0].i);

console.log('p2', guards[0].id * guards[0].mins[0].id);
