// just p2 here, takes ages to fully complete, bruteforce. I took biggest value found within first couple of minutes and submitted - it worked.
// todo: rewrite into proper solution by constructing the graph of intersections

const DS = [[1, 0], [0, 1], [-1, 0], [0, -1]];
const D =  {'>': 0, 'v': 1, '<': 2,  '^': 3 };

let map = input.split("\n").map((line, y) => line.split('').map((v, x) => {
    return v;
}))

const key = p => p[0] + '_' + p[1];
const addVect = (a, b) => [a[0]+b[0], a[1]+b[1]];

const getMoves = cur => {
    let moves = [];

    //let v = map[cur.p[1]][cur.p[0]]; // p1

    //if (D[v] !== undefined) moves.push(addVect(cur.p, DS[D[v]])); else // p1
        DS.forEach(d => moves.push(addVect(cur.p, d)) );

    return moves.filter(np => {
        if (map[np[1]] === undefined || map[np[1]][np[0]] === undefined || map[np[1]][np[0]] === '#') return false;
        if (cur.seen[key(np)] !== undefined) return false;
        return true;
    })
}

console.log(map);

let stack = [{p: [1, 0], steps: 0, seen: {}}],
    endPos = [map[0].length-2, map.length-1],
    maxSteps = 0;

let i = 0;

while (i < 10000000 && stack.length) {
    i++;
    let cur = stack.pop();

    let k = key(cur.p);
    cur.seen[k] = 1;

    let moves = getMoves(cur);
    while (moves.length == 1) {
        cur.seen[key(moves[0])] = 1;
        cur.steps++;
        cur.p = moves[0];
        moves = getMoves(cur);
    }

    if (cur.p[0] == endPos[0] && cur.p[1] == endPos[1]) {
        if (cur.steps > maxSteps) {
            maxSteps = cur.steps;
            console.log('found new max steps path', maxSteps, stack.length);
        }
        continue;
    }

    moves.forEach(np => stack.push({
        p: np,
        steps: cur.steps+1,
        seen: {...cur.seen}
    }))

}
