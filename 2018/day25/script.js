var constellations = [];

function dist(a,b) {
    var d = 0;
    for (var i = 0; i < 4; i++) {
        d = d+Math.abs(a[i]-b[i]);
    }
    return d;
}

function inConstellation(point, constellation) {
    var res = false;
    constellation.some(id => {
        if (dist(point, data[id]) <= 3) {
            res = true;
            return true;
        }
    })
    return res;
}

var start = 0, tmp = [];
var idsUsed = [];

function firstIdNotInConstellations() {
    var ptr = 0;
    while(idsUsed.includes(ptr)) {ptr++};
    return ptr;
}


while(idsUsed.length < data.length) {

    var startId = firstIdNotInConstellations();
    var currentConstellation = []; // indexes
    currentConstellation.push(startId);
    data.map((d, i) => {
        if (i != startId) {
            if (dist(d, data[startId]) <= 3) currentConstellation.push(i);
        }
    })
    //first estimate ready
    if (currentConstellation.length > 1) {
        var len = 0;
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
    //console.log('idsUsed', idsUsed);

}

console.log('constellations', constellations);
