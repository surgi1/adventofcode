// p2 is very slow
let start, end;
let map = input.split("\n").map((line, y) => line.split('').map((v, x) => {
    if (v == 'S') {
        start = {x: x, y: y};
        v = 'a';
    } else if (v == 'E') {
        end = {x: x, y: y};
        v = 'z';
    }
    return v.charCodeAt(0)-'a'.charCodeAt(0);
}))

const distToEnd = start => {
    const distMap = Array.from({length: map.length}, () => Array(map[0].length))

    const adjacent = (x, y, res = []) => {
        if (x > 0 && map[y][x-1] <= map[y][x]+1) res.push({x: x-1, y: y});
        if (y > 0 && map[y-1][x] <= map[y][x]+1) res.push({x: x, y: y-1});
        if (x < map[0].length-1  && map[y][x+1] <= map[y][x]+1) res.push({x: x+1, y: y});
        if (y < map.length-1  && map[y+1][x] <= map[y][x]+1) res.push({x: x, y: y+1});
        return res;
    }

    const spread = (x, y, steps) => {
        if (distMap[y][x] <= steps) return;
        distMap[y][x] = steps;
        adjacent(x, y).forEach(p => spread(p.x, p.y, steps+1));
    }

    spread(start.x, start.y, 0);
    return distMap[end.y][end.x];
}

const part2 = min => {
    console.log(min); // p1
    map.forEach((row, y) => row.forEach((v, x) => {
        if (v != 0) return true;
        let dmRes = distToEnd({x: x, y:y});
        if (dmRes != undefined) min = Math.min(min, dmRes);
    }))
    return min;
}

console.log(part2(distToEnd(start)));