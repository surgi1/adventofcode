const parse = input => input.split('\n').map(s => s.split('').map((v, i) => ({v: Number(v), id: i}) ));

const bestBattery = (bank, battery = {v: -1, id: -1}) => {
    bank.forEach(b => {
        if (b.v > battery.v) battery = {...b}
    })
    return battery;
}

const run = (data, count = 2) => data.reduce((a, row) => {
    let picked = [];
    for (let b = 0; b < count; b++) picked.push(bestBattery(row.filter((d, i) => {
        if (d.id > row.length - (count - b)) return false;
        if (b > 0 && d.id <= picked[picked.length-1].id) return false;
        return true;
    })))

    return a + Number(picked.map(b => b.v).join(''));
}, 0)

console.log('p1', run(parse(input)));
console.log('p2', run(parse(input), 12));
