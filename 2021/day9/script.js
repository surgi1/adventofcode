let map = [], cols = input[0].length, rows = input.length;

input.map((line, i) => map[i] = line.split('').map(n => parseInt(n)));

const part1 = (lowpoints = []) => {
    const adjacent = (x, y, res = []) => {
        if (x > 0) res.push(map[y][x-1]);
        if (y > 0) res.push(map[y-1][x]);
        if (x < cols-1) res.push(map[y][x+1]);
        if (y < rows-1) res.push(map[y+1][x]);
        return res;
    }

    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
        if (Math.min(...adjacent(x, y)) > map[y][x]) lowpoints.push({x: x, y: y})
    }

    console.log(lowpoints.reduce((acc, p) => acc+map[p.y][p.x]+1, 0));
    return lowpoints;
}

const part2 = lowpoints => {
    const spread = (x, y) => {
        if (map[y][x] < 9) basinSize++; else return;
        map[y][x] = 9;
        if (x > 0) spread(x-1, y);
        if (y > 0) spread(x, y-1);
        if (x < cols-1) spread(x+1, y);
        if (y < rows-1) spread(x, y+1);
    }

    let basinSizes = [], basinSize = 0;
    lowpoints.map(p => {
        basinSize = 0;
        spread(p.x, p.y);
        basinSizes.push(basinSize);
    })

    return basinSizes.sort((a, b) => b-a).splice(0, 3).reduce((acc, n) => acc*n, 1);
}

console.log(part2(part1()));