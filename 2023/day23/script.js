// p1: brute force dfs with remembering seen fields on path, sped up by traversing the narrow paths quickly
// p2: convert map to graph and dfs again

const DS = [[1, 0], [0, 1], [-1, 0], [0, -1]];
const D =  {'>': 0, 'v': 1, '<': 2,  '^': 3 };

let map = input.split("\n").map((line, y) => line.split('')),
    startPos = [1, 0],
    endPos = [map[0].length-2, map.length-1];

const key = p => p[0] + '_' + p[1];
const addVect = (a, b) => a.map((v, c) => v+b[c]);
const validPos = p => map[p[1]] !== undefined && map[p[1]][p[0]] !== undefined && map[p[1]][p[0]] !== '#';

const getGraph = () => {
    const addConnectNode = cur => {
        // try to locate existing one
        let newJuncId = nodes.findIndex(n => n.p[0] == cur.p[0] && n.p[1] == cur.p[1]);

        if (newJuncId == cur.lastJuncId) return newJuncId;

        if (newJuncId == -1) newJuncId = nodes.push({p: cur.p.slice(), connections: []})-1;

        // we need to connect cur.lastJuncId and newJuncId
        if (nodes[cur.lastJuncId].connections.findIndex(conn => conn.id == newJuncId) == -1) nodes[cur.lastJuncId].connections.push({
            id: newJuncId,
            distance: cur.steps - cur.stepsToLastJunc
        })

        if (nodes[newJuncId].connections.findIndex(conn => conn.id == cur.lastJuncId) == -1) nodes[newJuncId].connections.push({
            id: cur.lastJuncId,
            distance: cur.steps - cur.stepsToLastJunc
        })

        return newJuncId;
    }

    let stack = [{p: startPos.slice(), steps: 0, lastJuncId: 0, stepsToLastJunc: 0}],
        nodes = [{p: [1,0], connections: []}], seen = {};

    while (stack.length) {
        let cur = stack.pop(),
            k = key(cur.p),
            moves = DS.map(d => addVect(cur.p, d)).filter(validPos);

        if (moves.length > 2) {
            cur.lastJuncId = addConnectNode(cur);
            cur.stepsToLastJunc = cur.steps;
        }

        if (seen[k] !== undefined) continue;
        seen[k] = 1;

        if (cur.p[0] == endPos[0] && cur.p[1] == endPos[1]) {
            addConnectNode(cur);
            continue;
        }

        moves.forEach(np => stack.push({
            p: np,
            steps: cur.steps+1,
            lastJuncId: cur.lastJuncId,
            stepsToLastJunc: cur.stepsToLastJunc,
        }))

    }

    return nodes;
}

const part2 = () => {
    let nodes = getGraph();

    let stack = [{p: 0, steps: 0, seen: {}}],
        endNodeId = nodes.length-1,
        maxSteps = 0;

    while (stack.length) {
        let cur = stack.pop();

        cur.seen[cur.p] = 1;

        if (cur.p == endNodeId) {
            maxSteps = Math.max(cur.steps, maxSteps);
            continue;
        }

        nodes[cur.p].connections.filter(n => cur.seen[n.id] === undefined).forEach(n => stack.push({
            p: n.id,
            steps: cur.steps + n.distance,
            seen: {...cur.seen}
        }))
    }

    return maxSteps;
}

const part1 = () => {
    const getMoves = cur => {
        let moves = [], v = map[cur.p[1]][cur.p[0]];

        if (D[v] !== undefined) moves.push(addVect(cur.p, DS[D[v]]));
        else DS.forEach(d => moves.push(addVect(cur.p, d)) );

        return moves.filter(p => validPos(p) && cur.seen[key(p)] === undefined)
    }

    let stack = [{p: startPos.slice(), steps: 0, seen: {}}],
        maxSteps = 0;

    while (stack.length) {
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
            maxSteps = Math.max(maxSteps, cur.steps);
            continue;
        }

        moves.forEach(np => stack.push({
            p: np,
            steps: cur.steps+1,
            seen: {...cur.seen}
        }))
    }
    
    return maxSteps;
}

console.log('p1', part1());

console.log('p2', part2());