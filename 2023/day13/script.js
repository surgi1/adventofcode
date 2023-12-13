const rotate = source => {
    let result = [];
    source.forEach((a, i, aa) => {
        a.forEach((b, j, bb) => {
            result[bb.length - j - 1] = result[bb.length - j - 1] || [];
            result[bb.length - j - 1][i] = b;
        });
    });
    return result;
}

const findHorizMirror = (map, mult) => {
    let mirrorScores = [];
    for (let i = 0; i < map.length-1; i++) if (map[i].join('') == map[i+1].join('')) {
        // a possibility of mirror is here, need to verify all other available rows
        let mirrorBroken = false;
        let k = 0.5, j = i + 0.5;
        while (j - k >= 0 && j + k < map.length) {
            if (map[j-k].join('') !== map[j+k].join('')) mirrorBroken = true;
            k += 1;
        }
        if (!mirrorBroken) mirrorScores.push((i+1)*mult);
    }
    return mirrorScores;
}

const mapScore = (map, cmp = false) => [...findHorizMirror(map, 100), ...findHorizMirror(rotate(map).reverse(), 1)]

let maps = input.split("\n\n").map(map => map.split("\n").map(row => row.split('')) )

let count = 0, p2count = 0, mapScores = [];

maps.forEach((map, i) => {
    mapScores[i] = mapScore(map)[0];
    count += mapScores[i];

    // smudges
    for (let y = 0; y < map.length; y++) for (let x = 0; x < map[0].length; x++) {
        let nmap = map.map(row => row.slice());
        nmap[y][x] = nmap[y][x] == '.' ? '#' : '.';
        let diffs = mapScore(nmap).filter(n => n != mapScores[i]);
        if (diffs.length === 1) {
            p2count += diffs[0];
            return true;
        }
    }
})

console.log('p1', count);
console.log('p2', p2count);
