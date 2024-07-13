let sqinches = {}, claimIds = [];
const _k = (x, y) => x + '_' + y;

input.split('\n').map(line => {
    [id, x, y, w, h] = line.match(/\d+/g).map(Number);
    claimIds.push(id);
    for (let xx = x; xx < x+w; xx++)
        for (let yy = y; yy < y+h; yy++) {
            let k = _k(xx, yy);
            if (sqinches[k] === undefined) sqinches[k] = new Set();
            sqinches[k].add(id);
        }
})

console.log('p1', Object.values(sqinches).filter(v => v.size > 1).length);

let vals = Object.values(sqinches);

console.log('p2', claimIds.find(id => !vals.some(val => val.has(id) && val.size > 1))) // kind of sluggish