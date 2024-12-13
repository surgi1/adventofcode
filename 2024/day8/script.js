const init = input => {
    let grid = input.split("\n").map((line, y) => line.split('')), ants = {};
    grid.forEach((row, y) => row.forEach((v, x) => {
        if (v == '.') return true;
        if (ants[v] === undefined) ants[v] = [];
        ants[v].push([x, y])
    }))
    return [ants, grid.length, grid[0].length]
}

const run1 = (anodes = {}) => {
    Object.values(ants).forEach(locs => locs.forEach((loc1, i) => locs.forEach((loc2, j) => {
        if (j <= i) return true;
        let d = [0, 1].map(i => loc2[i] - loc1[i]);
        [loc1, loc2].map((loc, id) => [0, 1].map(i => loc[i] + (id*2 - 1)*d[i]))
                    .filter(loc => onGrid(loc))
                    .forEach(loc => anodes[loc.join('_')] = 1)
    })))
    return Object.keys(anodes).length;
}

const run2 = (anodes = {}) => {
    Object.values(ants).forEach(locs => locs.forEach((loc1, i) => locs.forEach((loc2, j) => {
        if (j <= i) return true;
        let d = [0, 1].map(i => loc2[i] - loc1[i]);
        
        // none of theese 3 is needed for my input, to my surprise
        if (d[0] == 0) d[1] = Math.sign(d[1]); 
        if (d[1] == 0) d[0] = Math.sign(d[1]);
        if (Math.abs(d[0]) == Math.abs(d[1])) d = d.map(v => Math.sign(v));

        [-1, 1].forEach(dir => {
            let loc = loc1.slice();
            while (onGrid(loc)) {
                anodes[loc.join('_')] = 1;
                loc = loc.map((v, i) => v+dir*d[i]);
            }
        })
    })))
    return Object.keys(anodes).length;
}

const onGrid = ([x, y]) => x >= 0 && y >= 0 && x < cols && y < rows;

let [ants, rows, cols] = init(input);

console.log('p1', run1());
console.log('p2', run2());
