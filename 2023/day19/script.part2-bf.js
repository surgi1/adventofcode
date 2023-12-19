let [flowsLit, cmpsLit] = input.split("\n\n");

let flows = {}, cmps = [];

flowsLit.split("\n").forEach(line => {
    let [id, opsLit] = line.match(/[^({|})]+/g);
    let ops = opsLit.split(',');

    flows[id] = ops.map(opLit => {
        let tmp = opLit.split(/:/g);
        if (tmp.length == 1) return tmp;

        let [k, v] = tmp[0].split(/<|>/g);
        if (tmp[0].includes('>')) {
            return [k, '>', Number(v), tmp[1]];
        } else {
            return [k, '<', Number(v), tmp[1]];
        }

    });
})

cmps = cmpsLit.split("\n").map(line => {
    let res = {},
        tmp = line.slice(1, -1).split(',').map(s => s.split('=')).forEach(ar => res[ar[0]] = Number(ar[1]));
    return res;
})

const condValid = (cond, cmp) => {
    if (cond.length == 1) return true;
    if (cond[1] == '>') {
        return cmp[cond[0]] > cond[2];
    } else {
        return cmp[cond[0]] < cond[2];
    }
}

const runFlow = (flowId, cmp) => {
    let flow = flows[flowId];
    //let i = 0;
    //while (!condValid(flow[i], cmp)) i++;
    for (let i = 0; i < flow.length; i++) {
        if (flow[i].length == 1) return flow[i][0];
        if (flow[i][1] == '>' && cmp[flow[i][0]] > flow[i][2]) return flow[i][3];
        if (flow[i][1] == '<' && cmp[flow[i][0]] < flow[i][2]) return flow[i][3];
    }

    //memo[key] = flow[i][flow[i].length-1];
    //return flow[i][flow[i].length-1];
}

const runFlows = cmp => {
    let opId = 'in';
    while (!['A', 'R'].includes(opId)) opId = runFlow(opId, cmp);
    return opId === 'A';
}

const part1 = () => cmps.reduce((res, cmp) => runFlows(cmp) ? res + Object.values(cmp).reduce((a, v) => a+v, 0) : res, 0)

//console.log('p1', part1());

// for p2 we need to run the ranges through the flows
// or, we could get the important values that would split all the ranges :shrug:

let grid = {x: [0, 4000], m: [0, 4000], a: [0, 4000], s: [0, 4000]};

Object.values(flows).forEach(flow => flow.forEach(cond => {
    if (cond.length == 1) return true;
    v = cond[2], adj = 1;
    if (cond[1] == '>') -1;
    //if (!grid[cond[0]].includes(v+adj)) grid[cond[0]].push(v+adj);
    if (!grid[cond[0]].includes(v)) grid[cond[0]].push(v);
    if (!grid[cond[0]].includes(v-adj)) grid[cond[0]].push(v-adj);
}))

Object.entries(grid).forEach(([k, v]) => grid[k] = v.sort((a, b) => a-b))

console.log(grid);

let i = 0, sum = 0;

for (let xi = 1; xi < grid.x.length; xi++) {
    console.log(xi);
    for (let mi = 1; mi < grid.m.length; mi++)
        for (let ai = 1; ai < grid.a.length; ai++)
            for (let si = 1; si < grid.s.length; si++) {
                if (runFlows({
                    x: grid.x[xi],
                    m: grid.m[mi],
                    a: grid.a[ai],
                    s: grid.s[si]
                })) sum += (grid.s[si] - grid.s[si-1]) * (grid.a[ai] - grid.a[ai-1]) * (grid.m[mi] - grid.m[mi-1]) * (grid.x[xi] - grid.x[xi-1]);
            }
}

console.log(sum);

// 33777472000000 too low
// 63839422080000 ?
// 134257479476284 ?