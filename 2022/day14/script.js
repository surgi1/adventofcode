const sandStart = [500,0];

let caves = input.split("\n").map(row => row.split(' -> ').map(p => p.split(',').map(Number))),
    maxX = Math.max(...caves.flat().map(v => v[0]))*2,
    maxY = Math.max(...caves.flat().map(v => v[1]));

const init = () => {
    const line = (from, to) => {
        let min = [ Math.min(from[0], to[0]), Math.min(from[1], to[1]) ],
            max = [ Math.max(from[0], to[0]), Math.max(from[1], to[1]) ];
        for (let i = min[0]; i <= max[0]; i++) for (let j = min[1]; j <= max[1]; j++) screen[j][i] = 1;
    }

    let screen = Array.from({length: maxY+3}, () => Array(maxX).fill(0));
    caves.forEach(point => point.forEach((p, i) => i && line(point[i-1], p)))
    return screen;
}

const dropSand = (screen, part2) => {
    let sand = sandStart.slice(), thru = false;

    while (true) {
        if (sand[1] > maxY+1) {thru = true; break }
        if (screen[sand[1]+1][sand[0]] == 0) { sand[1]++; continue }
        if (screen[sand[1]+1][sand[0]-1] == 0) { sand[1]++; sand[0]--; continue }
        if (screen[sand[1]+1][sand[0]+1] == 0) { sand[1]++; sand[0]++; continue }
        break;
    }

    screen[sand[1]][sand[0]] = 2;
    return part2 ? sand[1] == 0 : thru;
}

const simulate = (part2 = false, drops = 0) => {
    if (part2) caves.push([[0, maxY+2], [maxX*2, maxY+2]]);
    let screen = init();
    while (!dropSand(screen, part2)) drops++;
    return drops;
}

console.log(simulate());
console.log(simulate(true)+1);
