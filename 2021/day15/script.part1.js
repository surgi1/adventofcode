// part 1
let rows = input.length, cols = input[0].length;
let screen = input.map(row => row.split('').map(n => parseInt(n))), lowestReach = Array.from({length:rows}, v => Array(cols).fill(0));

let lowestRisk = (screen[rows-1].reduce((acc, n) => acc+n, 0) + screen.reduce((acc, row) => acc+row[0], 0))*0.7;
let paths = [{x:0, y:0, risk: -screen[0][0]}];

while (paths.length > 0) {
    let p = paths.pop();
    p.risk += screen[p.y][p.x];
    if ((p.risk < lowestRisk) && (p.risk < lowestReach[p.y][p.x] || lowestReach[p.y][p.x] == 0)) {
        lowestReach[p.y][p.x] = p.risk;
        if (p.x == cols-1 && p.y == rows-1) {
            if (p.risk < lowestRisk) {
                lowestRisk = p.risk;
                console.log('new lowest risk found', lowestRisk);
            }
        } else {
            if (p.x < cols-1) paths.push({ x:p.x+1, y:p.y, risk: p.risk })
            if (p.y < rows-1) paths.push({ x:p.x, y:p.y+1, risk: p.risk })
            if (p.x > 0) paths.push({ x:p.x-1, y:p.y, risk: p.risk })
            if (p.y > 0) paths.push({ x:p.x, y:p.y-1, risk: p.risk })
        }
    }
}

console.log(lowestRisk);