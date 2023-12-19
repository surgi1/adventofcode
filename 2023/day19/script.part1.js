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
    let flow = flows[flowId], i = 0;
    while (!condValid(flow[i], cmp)) i++;
    return flow[i][flow[i].length-1];
}

const runFlows = cmp => {
    let opId = 'in';
    while (!['A', 'R'].includes(opId)) opId = runFlow(opId, cmp);
    return opId === 'A';
}

const part1 = () => cmps.reduce((res, cmp) => runFlows(cmp) ? res + Object.values(cmp).reduce((a, v) => a+v, 0) : res, 0)

console.log('p1', part1());
