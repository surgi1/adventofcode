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

// part 2 backtracks from 'A' all the way back to 'in' flow, while refining ranges along the way
let sum = 0;

const backtrack = (resultId, b = {x: [1, 4000], m: [1, 4000], a: [1, 4000], s: [1, 4000]}) => {
    Object.entries(flows).forEach(([id, flow]) => {
        for (let condId = 0; condId < flow.length; condId++) {
            if (flow[condId][flow[condId].length-1] == resultId) {
                let i = condId;

                let bounds = {x: b.x.slice(), m: b.m.slice(), a: b.a.slice(), s: b.s.slice()}

                while (i >= 0) {
                    if (flow[i].length == 1) {i--; continue;}
                    let [par, op, val] = flow[i];
                    if (i == condId) {
                        //flow[j] was satisfied, what does it mean?
                        if (op == '>') {
                            // x > 5 was satisfied
                            if (bounds[par][0] <= val) bounds[par][0] = val+1;
                        } else {
                            // x < 5 was satisfied
                            if (bounds[par][1] >= val) bounds[par][1] = val-1;
                        }
                    } else {
                        //flow[j] was not satisfied, what does it mean?
                        if (op == '>') {
                            // x > 5 was not satisfied
                            if (bounds[par][1] > val) bounds[par][1] = val;
                        } else {
                            // x < 5 was not satisfied
                            if (bounds[par][0] < val) bounds[par][0] = val;
                        }
                    }
                    i--;
                }

                if (id == 'in') {
                    if (bounds.x[1] >= bounds.x[0] && bounds.m[1] >= bounds.m[0] && bounds.a[1] >= bounds.a[0] && bounds.s[1] >= bounds.s[0])
                        sum += (bounds.x[1] - bounds.x[0]+1) * (bounds.m[1] - bounds.m[0]+1) *(bounds.a[1] - bounds.a[0]+1) *(bounds.s[1] - bounds.s[0]+1);
                } else {
                    backtrack(id, bounds);
                }
            }
        }
    })
}

backtrack('A');

console.log('p2', sum);