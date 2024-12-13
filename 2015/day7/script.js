let equations = [], operations = ['AND', 'OR', 'RSHIFT', 'LSHIFT', 'NOT'], mem = {};

const parseEqLiteral = line => {
    let tmp = {
        dependsOn: [],
        solvable: false
    };
    let eq = line.split(' -> ');
    tmp.right = eq[1];
    tmp.left = eq[0].split(' ');

    tmp.left.map(part => {
        if (!operations.includes(part) && isNaN(part)) tmp.dependsOn.push(part);
    })

    equations.push(tmp);
}

const equationFor = letName => equations.filter(eq => eq.right == letName)[0];

const findSolvables = iter => {
    equations.filter(eq => eq.solvable === false).map(eq => {
        let solvable = true;
        eq.dependsOn.some(dep => {
            if (!equationFor(dep)?.solvable) solvable = false;
        })
        if (solvable) {
            eq.solvable = true;
            eq.iter = iter;
        }
    })
}

const value = v => {
    if (!isNaN(v)) return parseInt(v);
    else return mem[v];
}

const solveLeftSide = left => {
    if (left.length == 1) {
        return value(left[0]);
    } else if (left.length == 2) {
        return ~value(left[1]); // just NOT here
    } else {
        switch (left[1]) {
            case 'AND': return value(left[0]) & value(left[2]); break;
            case 'OR': return value(left[0]) | value(left[2]); break;
            case 'LSHIFT': return value(left[0]) << value(left[2]); break;
            case 'RSHIFT': return value(left[0]) >> value(left[2]); break;
        }
    }
}

const solveEquation = eq => {
    if (!mem[eq.right]) mem[eq.right] = solveLeftSide(eq.left);
}

input.map(line => parseEqLiteral(line));

const solve = () => {
    // create sorting strategy
    let i = 1;
    while (equations.filter(eq => eq.solvable === false).length > 0) {
        findSolvables(i);
        i++;
    }
    // solve equations
    equations.sort((a,b) => a.iter-b.iter).map(eq => solveEquation(eq));
    console.log('memory', mem);
}

solve();

// part1 result
let part1Result = mem['a'];

// reset
mem = {'b': part1Result};
equations.filter(eq => eq.right != 'b').map(eq => eq.solvable = false)

solve();