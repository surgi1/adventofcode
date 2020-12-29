const traverse = (vx, vy) => {
    let y = 0,
        x = 0,
        l = arr.length,
        trees = 0;

    while (y < l) {
        if (arr[y][x] == 1) trees++;
        y = y+vy;
        x = x+vx;
        if (x > 30) x = x-31;
    }

    return trees;
}

let paths = [
{vx: 1, vy: 1},
{vx: 3, vy: 1},
{vx: 5, vy: 1},
{vx: 7, vy: 1},
{vx: 1, vy: 2}
]

paths.forEach(path => path.trees = traverse(path.vx, path.vy));

console.log(paths);

//78*178*75*86*39=3492520200