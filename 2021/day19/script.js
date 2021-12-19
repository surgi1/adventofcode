const dist = (a,b, res = 0) => a.reduce((res, val, i) => res += (val-b[i])*(val-b[i]), 0)
const distFromProbe = (probes, probeId) => probes.map(p => dist(probes[probeId], p))
const matchArr = (a, b) => a.reduce((res, e) => res+(b.includes(e) ? 1 : 0), 0);
const beaconId = (scannerId, beaconNr) => 'b_'+scannerId+'_'+beaconNr;
const distinct = (value, index, self) => self.indexOf(value) === index;
const nextXformKey = b => Object.keys(xforms).filter(k => k.indexOf('_'+b+'_') > -1)[0];
const mDist = (a,b) => a.reduce((acc, v, i) => acc += Math.abs(v-b[i]), 0)

const matchScanners = (a, b, res = 0) => {
    for (let i = 0; i < scannerMeasures[a].length; i++) for (let j = 0; j < scannerMeasures[b].length; j++)
        res = Math.max(res, matchArr(scannerMeasures[a][i], scannerMeasures[b][j]));
    return res;
}

const markDuplicates = (a, b) => {
    for (let i = 0; i < scannerMeasures[a].length; i++) for (let j = 0; j < scannerMeasures[b].length; j++) {
        if (matchArr(scannerMeasures[a][i], scannerMeasures[b][j]) >= 3) {
            // mark all matches from bj
            scannerMeasures[b][j].map((d, probeId) => {
                let ind = scannerMeasures[a][i].indexOf(d);
                if (ind > -1) beacons[beaconId(b, probeId)] = beacons[beaconId(a, ind)];
            })
            break;
        }
    }
}

const constructTransMatrix = (va, vb) => {
    let res = Array.from({length:3}, e => Array(3).fill(0))
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (va[i] == vb[j]) res[i][j] = 1;
            if (va[i] == -vb[j]) res[i][j] = -1;
        }
    }
    return res;
}

const vecXmatrix = (v, matrix) => {
    let res = [];
    for (let i = 0; i < 3; i++) {
        res[i] = v[0]*matrix[0][i]+v[1]*matrix[1][i]+v[2]*matrix[2][i];
    }
    return res;
}

const vecMinusVec = (v1, v2, res = []) => {
    for (c = 0; c < 3; c++) res[c] = v2[c]-v1[c];
    return res;
}

const vecPlusVec = (v1, v2, res = []) => {
    for (c = 0; c < 3; c++) res[c] = v2[c]+v1[c];
    return res;
}

const determineScannerPosition = (a, b) => {
    if (scanners[a] === undefined && Array.isArray(scanners[b])) scanners[a] = scanners[b].slice(); else return;
    let found = false;
    for (let i = 0; i < scannerMeasures[a].length; i++) {
        for (let j = 0; j < scannerMeasures[b].length; j++) {
            if (matchArr(scannerMeasures[a][i], scannerMeasures[b][j]) >= 12) {
                found = true;
                // mark all matches from bj
                let pa = [], pb = [], va = [], vb = [];
                scannerMeasures[b][j].map((d, probeId) => {
                    let ind = scannerMeasures[a][i].indexOf(d);
                    if (ind > -1) {
                        pa.push(input[a][ind].slice());
                        pb.push(input[b][probeId].slice());
                    }
                })
                va = vecMinusVec(pa[1], pa[0]);
                vb = vecMinusVec(pb[1], pb[0]);
                let xform = constructTransMatrix(va, vb);
                let pa0_in_b = vecXmatrix(pa[0], xform);

                xforms['_'+a+'_'+b] = xform.slice();
                //console.log('computing', a, 'from', b);
                //console.log(a, b, pa, pb, va, vb, pa0_in_b, xform);

                scanners[a] = vecMinusVec(pa0_in_b, pb[0]);
                translate['_'+a+'_'+b] = scanners[a].slice();

                // need to get from b to 0
                while (b != 0) {
                    let k = nextXformKey(b), tmp = k.split('_').map(n => parseInt(n));
                    //console.log('executing', k, xforms[k], 'coords so far', a, b, scanners[a], scanners[b]);
                    scanners[a] = vecPlusVec(vecXmatrix(scanners[a], xforms[k]), translate[k]);
                    b = tmp[2];
                }
                //console.log('relative', a, 'to', b, scanners[a]);
                break;
            }
        }
        if (found) break;
    }
}

let scanners = [[0,0,0]], xforms = {}, translate = {}, groups = [], beacons = {}, uuid = 0;
input.map((probes, scannerId) => probes.map((coords, beaconNr) => beacons[beaconId(scannerId, beaconNr)] = uuid++))

let scannerMeasures = input.map((probeData, scannerId) => input[scannerId].map((p, i) => distFromProbe(input[scannerId], i)))

for (let i = 0; i < input.length; i++) {
    groups[i] = [];
    for (let j = 0; j < input.length; j++) {
        if (i==j) continue;
        let m = matchScanners(i, j);
        if (m >= 12) groups[i].push(j);
        if (m >= 3 && i>j) markDuplicates(i, j);
        if (m >= 12) determineScannerPosition(i, j);
    }
}

while (scanners.filter(s => Array.isArray(s)).length < input.length) {
    for (let i = 0; i < input.length; i++) if (scanners[i] == undefined) {
        for (let j = 0; j < input.length; j++) {
            if (i==j) continue;
            let m = matchScanners(i, j);
            if (m >= 12) determineScannerPosition(i, j);
        }
    }
}

console.log(Object.values(beacons).filter(distinct).length); // part 1

let maxDist = 0;
for (let i = 0; i < scanners.length; i++) for (let j = i+1; j < scanners.length; j++) {
    if (i==j) continue;
    maxDist = Math.max(maxDist, mDist(scanners[i], scanners[j]));
}

console.log(maxDist)