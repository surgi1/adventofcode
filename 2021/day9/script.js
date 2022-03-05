const adjacent = (map, x, y, res = []) => {
    if (x > 0) res.push({x: x-1, y: y});
    if (y > 0) res.push({x: x, y: y-1});
    if (x < map[0].length-1) res.push({x: x+1, y: y});
    if (y < map.length-1) res.push({x: x, y: y+1});
    return res;
}

const part1 = (map, res = []) => {
    map.map((r, y) => r.map((v, x) => Math.min(...adjacent(map, x, y).map(p => map[p.y][p.x])) > v && res.push({x: x, y: y})))
    console.log(res.reduce((a, p) => a+map[p.y][p.x]+1, 0));
    return [map, res];
}

const part2 = ([map, lowPoints], res = []) => {
    const spread = (x, y, o = {size: 0}) => {
        if (map[y][x] < 9) o.size++; else return;
        map[y][x] = 9;
        adjacent(map, x, y).map(p => spread(p.x, p.y, o));
        return o.size;
    }

    lowPoints.map(p => res.push(spread(p.x, p.y)))
    return res.sort((a, b) => b-a).slice(0, 3).reduce((a, n) => a*n, 1);
}

console.log(part2(part1(input.map(l => l.split('').map(Number)))));