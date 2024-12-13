const run = scale => {
    let rows = input.length, cols = input[0].length, screen = [],
        smallScreen = input.map(row => row.split('').map(Number)),
        lowestReach = Array.from({length:rows*scale}, v => Array(cols*scale).fill(0));

    for (let y = 0; y < rows*scale; y++) {
        screen[y] = [];
        for (let x = 0; x < cols*scale; x++) {
            let v = smallScreen[y % rows][x % cols]+Math.floor(y/rows)+Math.floor(x/cols);
            while (v > 9) v -= 9;
            screen[y][x] = v;
        }
    }

    let lowestRisk = (screen[rows*scale-1].reduce((a, n) => a+n, 0) + screen.reduce((a, r) => a+r[0], 0))*0.7;
    let paths = [{x:0, y:0, risk: -screen[0][0]}];

    while (paths.length) {
        let p = paths.pop();
        p.risk += screen[p.y][p.x];
        if ((p.risk < lowestRisk) && (p.risk < lowestReach[p.y][p.x] || lowestReach[p.y][p.x] == 0)) {
            lowestReach[p.y][p.x] = p.risk;
            if (p.x == (cols*scale-1) && p.y == (rows*scale-1)) {
                if (p.risk < lowestRisk) lowestRisk = p.risk;
            } else {
                if (p.x < cols*scale-1) paths.push({ x:p.x+1, y:p.y, risk: p.risk })
                if (p.y < rows*scale-1) paths.push({ x:p.x, y:p.y+1, risk: p.risk })
                if (p.x > 0) paths.push({ x:p.x-1, y:p.y, risk: p.risk })
                if (p.y > 0) paths.push({ x:p.x, y:p.y-1, risk: p.risk })
            }
        }
    }

    return lowestRisk;
}

console.log(run(1));
console.log(run(5)); // part 2 is pretty slow