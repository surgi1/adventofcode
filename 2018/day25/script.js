let constellations = [];

const dist = (a,b) => {
    let d = 0;
    for (let i = 0; i < 4; i++) {
        d = d+Math.abs(a[i]-b[i]);
    }
    return d;
}

const inConstellation = (point, constellation) => {
    let res = false;
    constellation.some(id => {
        if (dist(point, data[id]) <= 3) {
            res = true;
            return true;
        }
    })
    return res;
}

let start = 0, tmp = [];
let idsUsed = [];

const firstIdNotInConstellations = () => {
    let ptr = 0;
    while(idsUsed.includes(ptr)) {ptr++};
    return ptr;
}

while(idsUsed.length < data.length) {
    let startId = firstIdNotInConstellations();
    let currentConstellation = []; // indexes
    currentConstellation.push(startId);
    data.map((d, i) => {
        if (i != startId) {
            if (dist(d, data[startId]) <= 3) currentConstellation.push(i);
        }
    })
    //first estimate ready
    if (currentConstellation.length > 1) {
        let len = 0;
        while (len != currentConstellation.length) {
            len = currentConstellation.length;
            data.map((d, i) => {
                if (!currentConstellation.includes(i)) {
                    if (inConstellation(d, currentConstellation)) currentConstellation.push(i);
                }
            })
        }
    }
    console.log('constellation found', currentConstellation);
    constellations.push(currentConstellation);
    idsUsed.push(...currentConstellation);
}

console.log('constellations', constellations);
