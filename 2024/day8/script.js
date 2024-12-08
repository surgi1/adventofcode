const init = input => {
    let grid = input.split("\n").map((line, y) => line.split(''));
    let ants = {};
    grid.forEach((row, y) => row.forEach((v, x) => {
        if (v == '.') return true;
        if (ants[v] === undefined) ants[v] = [];
        ants[v].push([x, y])
    }))
    return [ants, grid.length, grid[0].length]
}

const run1 = (ants, rows, cols) => {
    const onGrid = ([x, y]) => x >= 0 && y >= 0 && x < cols && y < rows;
    let pts = {};

    Object.entries(ants).forEach(([ant, locs]) => locs.forEach((loc1, i) => locs.forEach((loc2, j) => {
        if (j <= i) return true;
        let d = [0, 1].map(i => loc1[i] - loc2[i]);
        let p1 = [0, 1].map(i => loc1[i] + d[i]);
        let p2 = [0, 1].map(i => loc2[i] - d[i]);
        if (onGrid(p1)) pts[p1.join('_')] = 1;
        if (onGrid(p2)) pts[p2.join('_')] = 1;
    })))

    return Object.keys(pts).length;
}

const run2 = (ants, rows, cols) => {
    const onGrid = ([x, y]) => x >= 0 && y >= 0 && x < cols && y < rows;
    let pts = {};
 
    Object.entries(ants).forEach(([ant, locs]) => locs.forEach((loc1, i) => locs.forEach((loc2, j) => {
        if (j <= i) return true;

        let d = [0, 1].map(i => loc1[i] - loc2[i]);
        
        if (d[0] == 0) d[1] = Math.sign(d[1]); // surprisingly not needed
        if (d[1] == 0) d[0] = Math.sign(d[1]); // surprisingly not needed

        [-1, 1].forEach(dir => {
            let p = loc1.slice();
            while (onGrid(p)) {
                pts[p.join('_')] = 1;
                p = p.map((v, i) => v+dir*d[i]);
            }
        })
    })))

    return Object.keys(pts).length;
}


console.log('p1', run1(...init(input)));
console.log('p2', run2(...init(input)));
