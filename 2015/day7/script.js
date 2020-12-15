var equations = [];
var operations = ['AND', 'OR', 'RSHIFT', 'LSHIFT', 'NOT'];
var mem = {};

function parseEqLiteral(line) {
    var tmp = {
        dependsOn: [],
        solvable: false
    };
    var eq = line.split(' -> ');
    tmp.right = eq[1];
    tmp.left = eq[0].split(' ');

    tmp.left.map(part => {
        if (!operations.includes(part) && isNaN(part)) tmp.dependsOn.push(part);
    })

    equations.push(tmp);
}

function equationFor(varName) {
    return equations.filter(eq => eq.right == varName)[0];
}

function findSolvables(iter) {
    equations.filter(eq => eq.solvable === false).map(eq => {
        var solvable = true;
        eq.dependsOn.some(dep => {
            if (!equationFor(dep)?.solvable) solvable = false;
        })
        if (solvable) {
            eq.solvable = true;
            eq.iter = iter;
        }
    })
}

function value(v) {
    if (!isNaN(v)) return parseInt(v);
    else return mem[v];
}

function solveLeftSide(left) {
    if (left.length == 1) {
        return value(left[0]);
    } else if (left.length == 2) {
        // just NOT here
        return ~value(left[1]);
    } else {
        switch (left[1]) {
            case 'AND': return value(left[0]) & value(left[2]); break;
            case 'OR': return value(left[0]) | value(left[2]); break;
            case 'LSHIFT': return value(left[0]) << value(left[2]); break;
            case 'RSHIFT': return value(left[0]) >> value(left[2]); break;
        }
    }
}

function solveEquation(eq) {
    if (!mem[eq.right]) mem[eq.right] = solveLeftSide(eq.left);
    console.log('solving', eq.right, '=', mem[eq.right]);
}

input.map(line => parseEqLiteral(line));

function solve() {
    // create sorting strategy
    var i = 1;
    while (equations.filter(eq => eq.solvable === false).length > 0) {
        findSolvables(i);
        i++;
        if (i % 10000 == 0) { console.log('handbreak'); break }
    }

    // solve equations
    equations.sort((a,b) => {
        return a.iter - b.iter;
    }).map(eq => solveEquation(eq))

    console.log('equations', equations);
    console.log('memory', mem);
}

solve();

// part1 result
var part1Result = mem['a'];

// reset
mem = {'b': part1Result};
equations.map(eq => {
    if (eq.right != 'b') eq.solvable = false;
})

solve();