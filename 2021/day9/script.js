let map = [], cols = input[0].length, rows = input.length;

input.map((line, i) => map[i] = line.split('').map(n => parseInt(n)));

const adjacent = (x, y, res = []) => {
    if (x > 0) res.push({x: x-1, y: y});
    if (y > 0) res.push({x: x, y: y-1});
    if (x < cols-1) res.push({x: x+1, y: y});
    if (y < rows-1) res.push({x: x, y: y+1});
    return res;
}

const part1 = (lowPoints = []) => {
    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) 
        if (Math.min(...adjacent(x, y).map(p => map[p.y][p.x])) > map[y][x]) lowPoints.push({x: x, y: y})

    console.log(lowPoints.reduce((acc, p) => acc+map[p.y][p.x]+1, 0));
    return lowPoints;
}

const part2 = lowPoints => {
    const spread = (x, y) => {
        if (map[y][x] < 9) basinSize++; else return;
        map[y][x] = 9;
        adjacent(x, y).map(p => spread(p.x, p.y));
    }

    let basinSizes = [], basinSize = 0;
    lowPoints.map(p => {
        basinSize = 0;
        spread(p.x, p.y);
        basinSizes.push(basinSize);
    })

    return basinSizes.sort((a, b) => b-a).slice(0, 3).reduce((acc, n) => acc*n, 1);
}

console.log(part2(part1()));