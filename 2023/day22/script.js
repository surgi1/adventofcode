// takes some time to process all the blocks

let blocks = input.split("\n").map(line => line.split('~').map(c => c.split(',').map(Number)))
                  .sort((a, b) => b[1][2] - a[1][2]);

const getState = blocks => blocks.map(b => b[1][2]).join(',');

const fall = blocks => {
    blocks.forEach((b, i) => {
        if (b[0][2] <= 1) return true;

        let z = b[0][2]-1,
            canFall = true;

        for (let x = b[0][0]; x <= b[1][0]; x++) for (let y = b[0][1]; y <= b[1][1]; y++) {
            if (blocks.some((o, j) => i !== j && o[0][0] <= x && o[1][0] >= x && o[0][1] <= y && o[1][1] >= y && o[0][2] <= z && o[1][2] >= z)) {
                canFall = false;
                break;
            }
        }
        if (canFall) {
            b[1][2]--;
            b[0][2]--;
            fallen.add(i);
        }
    })
}

const fallFull = blocks => {
    let state = '';
    while (state !== getState(blocks)) {
        state = getState(blocks);
        fall(blocks);
    }
    return state;
}

let fallen = new Set(),
    p1 = 0, p2 = 0;

fallFull(blocks);

blocks.forEach((b, i) => {
    console.log(i);
    fallen = new Set();
    let nblocks = JSON.parse(JSON.stringify(blocks));
    nblocks.splice(i, 1);
    let state = getState(nblocks);
    if (fallFull(nblocks) === state) p1++;
    p2 += fallen.size;
})

console.log('p1', p1);
console.log('p2', p2);
