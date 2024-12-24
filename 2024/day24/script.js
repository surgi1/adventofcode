const init = input => {
    let [initLit, logicLit] = input.split('\n\n');
    let gates = {};
    initLit.split('\n').map(line => {
        let [gate, v] = line.split(': ');
        gates[gate] = Number(v);
    })

    let logic = logicLit.split('\n').map(line => {
        let [leftLit, right] = line.split(' -> ');
        let left = leftLit.split(' ');
        return {
            in: [left[0], left[2]],
            op: left[1],
            out: right
        }
    })
    return [gates, logic];
}

const gatesToBin = (gates, wire) => Object.entries(gates).filter(([k, v]) => k[0] == wire).sort(([k1, v1], [k2, v2]) => k2.localeCompare(k1)).map(([k, v]) => v).join('')
const compileP2 = s => s.split(',').sort((a, b) => a.localeCompare(b)).join(',');

const run1 = (gates, logic) => {
    let loop = true;
    while (loop) {
        loop = false;
        logic.forEach(o => {
            if (gates[o.in[0]] === undefined || gates[o.in[1]] === undefined) {
                loop = true;
                return true;
            }
            switch (o.op) {
                case 'AND': gates[o.out] = gates[o.in[0]] & gates[o.in[1]]; break;
                case 'OR': gates[o.out] = gates[o.in[0]] | gates[o.in[1]]; break;
                case 'XOR': gates[o.out] = gates[o.in[0]] ^ gates[o.in[1]]; break;
            }
        })
    }

    return Number('0b'+gatesToBin(gates, 'z'));
}

// solved p2 by manual approach for the time being, these are mainly helper functions. Check solution.md in this repo for detailed description.
// automated approach coming after xmess.
const run = (gates, logic) => {
    let loop = true;
    while (loop) {
        loop = false;
        logic.forEach(o => {
            if (gates[o.in[0]] === undefined || gates[o.in[1]] === undefined) {
                loop = true;
                return true;
            }
            switch (o.op) {
                case 'AND': gates[o.out] = gates[o.in[0]] & gates[o.in[1]]; break;
                case 'OR': gates[o.out] = gates[o.in[0]] | gates[o.in[1]]; break;
                case 'XOR': gates[o.out] = gates[o.in[0]] ^ gates[o.in[1]]; break;
            }
        })
    }

    // for each z we need to check the inputs
    let mains = {x: [], y: [], z: []};
    ['x', 'y', 'z'].forEach(wire => {
        mains[wire] = Object.keys(gates).filter(k => k[0] == wire).sort((k1, k2) => k2.localeCompare(k1));
    })
    console.log('mains', mains);

    let gate = 'z15';
    const logExpressionTree = gate => {
        let last = logic.filter(o => o.out == gate);
        let stack = [...last], cur;
        while (cur = stack.shift()) {
            console.log(cur.out, cur.in.join(' ' + cur.op + ' '));
            stack.push(...logic.filter(o => o.out == cur.in[0] || o.out == cur.in[1]))
        }
    }

    //logExpressionTree(gate);

    const expr = e => {
        let s = '';
        if (mains.x.includes(e.in[0]) || mains.y.includes(e.in[0])) s += e.in[0];
        else s += '('+ expr(logic.filter(o => o.out == e.in[0])[0]) + ')';
        s += ' ' + e.op + ' ';
        if (mains.x.includes(e.in[1]) || mains.y.includes(e.in[1])) s += e.in[1];
        else s += '('+ expr(logic.filter(o => o.out == e.in[1])[0]) + ')';
        return s;
    }

    mains.z.forEach(gate => {
        let e = logic.filter(o => o.out == gate)[0];
        console.log(e.out + ' = ' + expr(e));
    })

    console.log('gates', gates);
    //return gatesToDec(gates, 'z');

    ['x', 'y', 'z'].forEach(wire => console.log(wire, gatesToBin(gates, wire)))
}



console.log('p1', run1(...init(input)))
console.log('p2', run(...init(input)))
