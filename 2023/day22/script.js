// initiates arrays of block ids supporting and being supportd by each block, then computes the results
// blocks[i][2] = ids of blocks supporting this one
// blocks[i][3] = blocks supported by this one

let blocks = input.split("\n").map(line => line.split('~').map(c => c.split(',').map(Number)))
                  .map(v => [...v, [], []]); // adding 2 extra fields for supports and supported by

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
        }
    })
}

const computeSupports = blocks => {
    blocks.forEach((b, i) => {
        if (b[0][2] <= 1) return true;
        
        let supports = [],
            z = b[0][2],
            found = false;
        
        while (z > 1 && !found) {
            z--;
            for (let x = b[0][0]; x <= b[1][0]; x++)
                for (let y = b[0][1]; y <= b[1][1]; y++)
                    for (let sId = 0; sId < blocks.length; sId++) {
                        let o = blocks[sId];
                        if (i !== sId && o[0][0] <= x && o[1][0] >= x && o[0][1] <= y && o[1][1] >= y && o[0][2] <= z && o[1][2] >= z) {
                            if (!supports.includes(sId)) supports.push(sId);
                            found = true;
                        }
                    }
        }
        b[2] = supports;
        supports.forEach(supId => {
            if (!blocks[supId][3].includes(i)) blocks[supId][3].push(i);
        })
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

let brokenSupports;

const sumSupporteds = i => blocks[i][3].forEach(j => {
    if (blocks[j][2].every(k => brokenSupports.includes(k))) {
        brokenSupports.push(j);
        sumSupporteds(j);
    }
});

fallFull(blocks);
computeSupports(blocks);

console.log('p1', blocks.filter(o => {
    if (o[3].length == 0) return true;
    return !o[3].some(sId => blocks[sId][2].length == 1);
}).length)

console.log('p2', blocks.reduce((res, o, id) => {
    brokenSupports = [];
    brokenSupports.push(id);
    sumSupporteds(id);
    return res + brokenSupports.length-1;
}, 0))
