// size may need adjustment for generic input
let grid = [], size = 300, steps = 100;

const init = () => {
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            if (!grid[y]) grid[y] = [];
            grid[y][x] = 0; // starts in white
        }
    }

    input.map((line, lineId) => {
        let x = size/2, y = size/2;
        for (let i = 0; i < line.length; i++) {
            let dir = line[i];
            if (!['w', 'e'].includes(dir)) {
                i++; dir += line[i];
            }
            switch (dir) {
                case 'w': x -= 2; break;
                case 'e': x += 2; break;
                case 'ne': y -= 1; x += 1; break;
                case 'nw': y -= 1; x -= 1; break;
                case 'se': y += 1; x += 1; break;
                case 'sw': y += 1; x -= 1; break;
            }
        }
        grid[y][x] = (grid[y][x] == 0 ? 1 : 0);
    })
}

const countBlackTiles = () => {
    let count = 0;
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            if (grid[y][x] == 1) count++;
        }
    }
    return count;
}

const getBlackAround = (g, x, y) => {
    let count = 0;
    if (g[y][x-2] == 1) count++;
    if (g[y][x+2] == 1) count++;
    if (g[y-1][x-1] == 1) count++;
    if (g[y-1][x+1] == 1) count++;
    if (g[y+1][x-1] == 1) count++;
    if (g[y+1][x+1] == 1) count++;
    return count;
}

const progressState = oldGrid => {
    let newGrid = oldGrid.map(row => row.slice());

    for (let y = 1; y < size-1; y++) {
        for (let x = 2; x < size-2; x++) {
            let blackAround = getBlackAround(oldGrid, x, y);
            if (oldGrid[y][x] == 1 && (blackAround == 0 || blackAround > 2)) newGrid[y][x] = 0;
            if (oldGrid[y][x] == 0 && blackAround == 2) newGrid[y][x] = 1;
        }
    }
    return newGrid;
}

init();
console.log('part 1', countBlackTiles());

for (let i = 0; i < steps; i++) grid = progressState(grid);
console.log('part 2', countBlackTiles());
