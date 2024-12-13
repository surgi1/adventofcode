const rotate = source => {
    let result = [];
    source.forEach((a, i, aa) => a.forEach((b, j, bb) => {
        result[bb.length - j - 1] = result[bb.length - j - 1] || [];
        result[bb.length - j - 1][i] = b;
    }));
    return result;
}

const findMirrors = (map, mult) => {
    let scores = [];
    for (let i = 0; i < map.length-1; i++) if (map[i].join('') == map[i+1].join('')) {
        let broken = false,
            k = 0.5, j = i + 0.5;

        while (j - k >= 0 && j + k < map.length) {
            if (map[j-k].join('') !== map[j+k].join('')) broken = true;
            k += 1;
        }
        if (!broken) scores.push((i+1)*mult);
    }
    return scores;
}

const mapScores = map => [...findMirrors(map, 100), ...findMirrors(rotate(map).reverse(), 1)]

let maps = input.split("\n\n").map(map => map.split("\n").map(row => row.split('')))
let p2 = 0, p1 = [];

maps.forEach((map, i) => {
    p1[i] = mapScores(map)[0];

    // smudges
    for (let y = 0; y < map.length; y++) for (let x = 0; x < map[0].length; x++) {
        let nmap = map.map(row => row.slice());
        nmap[y][x] = nmap[y][x] == '.' ? '#' : '.';

        let diffs = mapScores(nmap).filter(n => n != p1[i]);

        if (diffs.length === 1) {
            p2 += diffs[0];
            return true;
        }
    }
})

console.log('p1', p1.reduce((a, v) => a+v, 0));
console.log('p2', p2);
