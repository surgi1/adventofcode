// For Part 1 we construct scannerMeasures: a relative distance squares of every other beacon for each base beacon (within given scanner data).
// These are clearly invariants between scanners, so can be easily used to identify overlapping scanners. Next we match uuided beacons to count them off and we're done.

// For Part 2, we need to determine the transformation matrixes between scanners that have overlaps. The goal is to have each scanner's position in scanner[0] base.
// The orientation of 2 scanners that have overlapping beacons is done by constructing rotation matrix between 2 matching nodes seen from each scanner's perspective
// and translation vector after projecting those 2 beacons into the same space.
// The last trick here is to realize, that the projections are chained; if there is a scanner[2] overlapping with scanner[1], and scanner[1] overlapping
// with scanner[0], then in order to transform coordinates from scanner[2] to scanner[0], it is necessary to first project from scanner[2] to scanner[1]
// base (both rotation and translation), and the result of this into scanner[0] space.

const dist = (a,b, res = 0) => a.reduce((res, val, i) => res += (val-b[i])*(val-b[i]), 0)
const distFromBeacon = (beacons, id) => beacons.map(p => dist(beacons[id], p))
const matchArr = (a, b) => a.reduce((res, e) => res+(b.includes(e) ? 1 : 0), 0);
const beaconId = (scannerId, beaconNr) => 'b_'+scannerId+'_'+beaconNr;
const distinct = (value, index, self) => self.indexOf(value) === index;
const nextTransformKey = b => Object.keys(baseTransforms).filter(k => k.indexOf('_'+b+'_') > -1)[0];
const manhattanDist = (a,b) => a.reduce((acc, v, i) => acc += Math.abs(v-b[i]), 0)
const vectMatrixProduct = (v, matrix) => v.map((e, i) => v[0]*matrix[0][i]+v[1]*matrix[1][i]+v[2]*matrix[2][i]);
const vectAdd = (u, v) => v.map((e, i) => e+u[i]);
const vectSub = (u, v) => vectAdd(u, v.map(n=>-n));

const constructTransformMatrix = (u, v) => {
    let res = Array.from({length:3}, e => Array(3).fill(0))
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
        if (u[i] == v[j]) res[i][j] = 1;
        if (u[i] == -v[j]) res[i][j] = -1;
    }
    return res;
}

const matchScanners = (a, b, res = 0) => {
    for (let i = 0; i < scannerMeasures[a].length; i++) for (let j = 0; j < scannerMeasures[b].length; j++)
        res = Math.max(res, matchArr(scannerMeasures[a][i], scannerMeasures[b][j]));
    return res;
}

const markDuplicates = (a, b) => scannerMeasures[a].forEach(sma => scannerMeasures[b].forEach(smb => {
    if (matchArr(sma, smb) < 3) return true;
    // identify matching nodes
    smb.map((d, id) => {
        let index = sma.indexOf(d);
        if (index > -1) beacons[beaconId(b, id)] = beacons[beaconId(a, index)];
    })
}))

const determineScannerPosition = (a, b) => {
    if (scanners[a] === undefined && Array.isArray(scanners[b])) scanners[a] = []; else return;
    scannerMeasures[a].forEach(sma => scannerMeasures[b].forEach(smb => {
        if (matchArr(sma, smb) < 12) return true;
        // identify matching nodes
        let pa = [], pb = [];
        smb.map((d, id) => {
            let index = sma.indexOf(d);
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
            let k = nextTransformKey(b);
            scanners[a] = vectAdd(vectMatrixProduct(scanners[a], baseTransforms[k]), translations[k]);
            b = k.split('_').pop();
        }
    }))
}

let scanners = [[0,0,0]], baseTransforms = {}, translations = {}, beacons = {}, uuid = 0;
let scannerMeasures = input.map((beaconData, scannerId) => input[scannerId].map((p, i) => distFromBeacon(input[scannerId], i)))

input.map((beaconData, scannerId) => beaconData.map((d, beaconNr) => beacons[beaconId(scannerId, beaconNr)] = uuid++))

for (let i = 0; i < input.length; i++) for (let j = i+1; j < input.length; j++) markDuplicates(i, j);
console.log(Object.values(beacons).filter(distinct).length); // part 1

// unnecessarily greedy part to finish finding the scanners positions
while (scanners.filter(s => Array.isArray(s)).length < input.length) {
    for (let i = 0; i < input.length; i++) if (scanners[i] == undefined)
        for (let j = 0; j < input.length; j++) if (i != j && matchScanners(i, j) >= 12) determineScannerPosition(i, j);
}

console.log(Math.max(...scanners.map(s1 => Math.max(...scanners.map(s2 => manhattanDist(s1, s2)))))); // part2
