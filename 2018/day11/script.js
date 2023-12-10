const sn = 8772;

let grid = Array.from({length: 301}, () => Array(301));

for (let y = 1; y <= 300; y++) for (let x = 1; x <= 300; x++) {
    let rackId = x+10;
    let pow = (rackId*y + sn) * rackId;
    pow = pow.toString();
    pow = pow[pow.length-3];
    grid[y][x] = Number(pow) - 5;
}

const getPow = (x, y, len = 3) => {
    let res = 0;
    for (let j = y; j < y+len; j++) for (let i = x; i < x+len; i++) res += grid[j][i];
    return res;
}

let max = 0, maxCoords = [0, 0, 0];
for (let size = 3; size < 30; size++) {
    for (let y = 1; y <= 300-size; y++) for (let x = 1; x <= 300-size; x++) {
        let pow = getPow(x, y, size);
        if (pow > max) {
            max = pow;
            maxCoords = [x, y, size];
        }
    }
    if (size == 3) console.log('p1', [maxCoords[0], maxCoords[1]].join(','));
}

console.log('p2', maxCoords.join(','));