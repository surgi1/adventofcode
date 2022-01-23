let input = [
'.#.#.',
'.##..',
'.#...',
'.###.',
'##..#']

const init = input => input.map(line => line.split('').map(v => v == '#' ? 1 : 0))
const bugEvo = (v, bugs) => (v ? (bugs != 1 ? 0 : v) : ([1,2].includes(bugs) ? 1 : v))
const adjacentBugs = (map, u, v, count = 0) => {
    [-1,0,1].forEach(i => [-1,0,1].forEach(j => {
        let y = v+i, x = u+j;
        if (y < 0 || y > 4 || x < 0 || x > 4 || (i == 0 && j == 0) || i*j != 0) return true;
        count += map[y][x];
    }))
    return count;
}

const part1 = (state, visited = [], biodiv) => {
    const progressState = s => s.map((row, y) => row.map((v, x) => bugEvo(v, adjacentBugs(s, x, y))))
    while (!visited.includes(biodiv)) {
        visited.push(biodiv);
        state = progressState(state);
        biodiv = parseInt(state.flat().reverse().join(''), 2);
    }
    return biodiv;
}

const part2 = map => {
    const adjacentBugsRec = (state, level, x, y, count = 0) => {
        if (x == 0) count += state[level-1][2][1];
        if (y == 0) count += state[level-1][1][2];

        if (x == 4) count += state[level-1][2][3];
        if (y == 4) count += state[level-1][3][2];

        if (x == 2 && y == 1) count += state[level+1][0].reduce((a, b) => a+b, 0);
        if (x == 2 && y == 3) count += state[level+1][4].reduce((a, b) => a+b, 0);

        if (x == 1 && y == 2) count += state[level+1].reduce((a, v) => a+v[0], 0);
        if (x == 3 && y == 2) count += state[level+1].reduce((a, v) => a+v[4], 0);

        return count + adjacentBugs(state[level], x, y); // plus normal ones
    }

    const progressState = s => s.map((map, level) => map.map((row, y) => row.map((v, x) => 
        (level == 0 || level > 218 || (x == 2 && y == 2)) ? v : bugEvo(v, adjacentBugsRec(s, level, x, y)))))

    let levels = Array.from({length:220}, (v, i) => i == 110 ? map : Array(5).fill(Array(5).fill(0)));

    for (let i = 0; i < 200; i++) levels = progressState(levels);

    return levels.flat().flat().reduce((a, v) => a+v, 0);
}

console.log('part 1', part1(init(input)));
console.log('part 2', part2(init(input)));