const dist = (a,b, res = 0) => a.reduce((res, val, i) => res += (val-b[i])*(val-b[i]), 0)
const distFromBeacon = (beacons, id) => beacons.map(p => dist(beacons[id], p))
const matchArr = (a, b) => a.reduce((res, e) => res+(b.includes(e) ? 1 : 0), 0);
const beaconId = (scannerId, beaconNr) => 'b_'+scannerId+'_'+beaconNr;
const distinct = (value, index, self) => self.indexOf(value) === index;
const nextTransformKey = b => Object.keys(baseTransforms).filter(k => k.indexOf('_'+b+'_') > -1)[0];
const manhattanDist = (a,b) => a.reduce((acc, v, i) => acc += Math.abs(v-b[i]), 0)
const vectMatrixProduct = (v, matrix) => v.map((e, i) => v[0]*matrix[0][i]+v[1]*matrix[1][i]+v[2]*matrix[2][i]);
const vectSub = (v1, v2) => v2.map((e, i) => e-v1[i]);
const vectAdd = (v1, v2) => v2.map((e, i) => e+v1[i]);

const matchScanners = (a, b, res = 0) => {
    for (let i = 0; i < scannerMeasures[a].length; i++) for (let j = 0; j < scannerMeasures[b].length; j++)
        res = Math.max(res, matchArr(scannerMeasures[a][i], scannerMeasures[b][j]));
    return res;
}

const markDuplicates = (a, b) => {
    for (let i = 0; i < scannerMeasures[a].length; i++) for (let j = 0; j < scannerMeasures[b].length; j++) {
        if (matchArr(scannerMeasures[a][i], scannerMeasures[b][j]) < 3) continue;
        // mark all matches from bj
        scannerMeasures[b][j].map((d, id) => {
            let index = scannerMeasures[a][i].indexOf(d);
            if (index > -1) beacons[beaconId(b, id)] = beacons[beaconId(a, index)];
        })
    }
}

const constructTransformMatrix = (u, v) => {
    let res = Array.from({length:3}, e => Array(3).fill(0))
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
        if (u[i] == v[j]) res[i][j] = 1;
        if (u[i] == -v[j]) res[i][j] = -1;
    }
    return res;
}

const determineScannerPosition = (a, b) => {
    if (scanners[a] === undefined && Array.isArray(scanners[b])) scanners[a] = []; else return;
    for (let i = 0; i < scannerMeasures[a].length; i++) {
        for (let j = 0; j < scannerMeasures[b].length; j++) {
            if (matchArr(scannerMeasures[a][i], scannerMeasures[b][j]) < 12) continue;
            // mark all matches from bj
            let pa = [], pb = [];
            scannerMeasures[b][j].map((d, id) => {
                let index = scannerMeasures[a][i].indexOf(d);
                if (index > -1) {
                    pa.push(input[a][index]);
                    pb.push(input[b][id]);
                }
            })
            let xform = constructTransformMatrix(vectSub(pa[1], pa[0]), vectSub(pb[1], pb[0]));
            baseTransforms['_'+a+'_'+b] = xform.slice();
            scanners[a] = vectSub(vectMatrixProduct(pa[0], xform), pb[0]); // pa[0] in b-base minus pb[0]
            translations['_'+a+'_'+b] = scanners[a].slice(); // save this translation for later use

            // need to get from b to 0
            while (b != 0) {
                let k = nextTransformKey(b), tmp = k.split('_');
                scanners[a] = vectAdd(vectMatrixProduct(scanners[a], baseTransforms[k]), translations[k]);
                b = tmp[2];
            }
        }
    }
}

let scanners = [[0,0,0]], baseTransforms = {}, translations = {}, beacons = {}, uuid = 0, maxDist = 0;
let scannerMeasures = input.map((beaconData, scannerId) => input[scannerId].map((p, i) => distFromBeacon(input[scannerId], i)))

input.map((beaconData, scannerId) => beaconData.map((d, beaconNr) => beacons[beaconId(scannerId, beaconNr)] = uuid++))

for (let i = 0; i < input.length; i++) for (let j = i+1; j < input.length; j++) markDuplicates(i, j);
console.log(Object.values(beacons).filter(distinct).length); // part 1

// unnecessarily greedy part to finish finding the scanners positions
while (scanners.filter(s => Array.isArray(s)).length < input.length) {
    for (let i = 0; i < input.length; i++) if (scanners[i] == undefined)
        for (let j = 0; j < input.length; j++) if (i != j && matchScanners(i, j) >= 12) determineScannerPosition(i, j);
}

scanners.forEach(s1 => scanners.forEach(s2 => maxDist = Math.max(maxDist, manhattanDist(s1, s2))))
console.log(maxDist) // part 2