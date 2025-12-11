const parse = input => input.split('\n').map(line => {
    let machine = {
        target: 0,
        masks: [], // xor masks
        buttons: [],
        value: 0,
        joltageTargets: 0,
    }
    let emptyMask;
    line.split(' ').forEach(v => {
        let s = v.substr(1, v.length-2);
        if (v[0] == '[') {
            machine.target = Number('0b'+s.split('').map(l => l == '#' ? '1' : '0').join(''));
            emptyMask = s.split('').map(l => '0');
            machine.emptyMask = emptyMask;
        } else if (v[0] == '(') {
            machine.buttons.push(s.split(',').map(Number));
            let mask = emptyMask.slice(0);
            s.split(',').map(Number).forEach(n => mask[n] = '1');
            machine.masks.push( Number('0b' + mask.join('')) );
        } else if (v[0] == '{') {
            machine.joltageTargets = s.split(',').map(Number);
        }
    })
    return machine;
})

/**********************************************************************
 *  ILP Solver for:  Minimize sum(x) subject to
 * 
 *       A x = b
 *       x >= 0, integer
 * 
 *  Core idea:
 *   1) Perform integer-preserving Gaussian elimination (no division).
 *   2) Identify pivot variables and free variables.
 *   3) Solve pivot variables EXACTLY by back-substitution.
 *   4) Branch-and-bound over free variables with automatic bounds.
 **********************************************************************/

function solveILP(A, b, eps = 1e-12) {

    const m = A.length;
    const n = A[0].length;

    // Build augmented matrix M = [A | b]
    let M = A.map((row, i) => [...row, b[i]]);

    /******************************************************************
     * Step 0 — compute safe upper bounds for variables
     * 
     * Given A[row][col] * x[col] <= b[row] when A is 0/1,
     * we estimate:
     * 
     *       x[col] ≤ min_r ceil(b[r] / A[r][col]).
     ******************************************************************/
    const upperBound = Array(n).fill(Infinity);

    for (let c = 0; c < n; c++) {
        let ub = Infinity;
        for (let r = 0; r < m; r++) {
            if (M[r][c] > 0) {
                ub = Math.min(ub, Math.ceil(M[r][n] / M[r][c]));
            }
        }
        upperBound[c] = Number.isFinite(ub) ? ub : 0;
    }

    /******************************************************************
     * Step 1 — Integer-preserving Gaussian elimination (no division)
     ******************************************************************/
    function swapRows(i, j) {
        const tmp = M[i];
        M[i] = M[j];
        M[j] = tmp;
    }

    let pivotRow = 0;

    for (let col = 0; col < n && pivotRow < m; col++) {
        // Find pivot with largest |value| in this column
        let best = pivotRow, bestVal = Math.abs(M[pivotRow][col]);
        for (let r = pivotRow + 1; r < m; r++) {
            const v = Math.abs(M[r][col]);
            if (v > bestVal) {
                best = r;
                bestVal = v;
            }
        }
        if (bestVal < eps) continue; // Column is zero → skip

        if (best !== pivotRow) swapRows(pivotRow, best);

        // Eliminate below pivot using integer-preserving elimination
        for (let r = pivotRow + 1; r < m; r++) {
            if (Math.abs(M[r][col]) < eps) continue;
            const factor = M[r][col] / M[pivotRow][col];

            // Zero out M[r][col]
            M[r][col] = 0;

            // Subtract multiple of pivot row from r
            for (let k = col + 1; k <= n; k++) {
                M[r][k] -= factor * M[pivotRow][k];
            }
        }

        pivotRow++;
    }

    /******************************************************************
     * Step 2 — Identify pivot columns vs free columns
     ******************************************************************/
    const isPivot = Array(n).fill(false);

    for (let r = 0; r < m; r++) {
        for (let c = 0; c < n; c++) {
            if (Math.abs(M[r][c]) > eps) {
                isPivot[c] = true;
                break;
            }
        }
    }

    const pivotCols = [];
    const freeCols  = [];
    for (let c = 0; c < n; c++) {
        if (isPivot[c]) pivotCols.push(c);
        else freeCols.push(c);
    }

    /******************************************************************
     * Step 3 — Back-substitution solver for pivot variables
     ******************************************************************/
    function backSubstitute(freeAssign) {
        const x = { ...freeAssign };

        for (let r = m - 1; r >= 0; r--) {
            let rhs = M[r][n];
            let pivotVar = -1;

            for (let c = 0; c < n; c++) {
                if (Math.abs(M[r][c]) > eps) {
                    if (pivotVar === -1) pivotVar = c;
                    else {
                        if (x[c] === undefined) return null;
                        rhs -= M[r][c] * x[c];
                    }
                }
            }

            if (pivotVar === -1) {
                if (Math.abs(rhs) > eps) return null;
                continue;
            }

            const coeff = M[r][pivotVar];
            let val = rhs / coeff;

            // Must be an integer
            if (Math.abs(val - Math.round(val)) > eps) return null;
            val = Math.round(val);

            if (val < 0) return null;
            if (val > upperBound[pivotVar]) return null;

            x[pivotVar] = val;
        }

        // Fill missing variables with 0
        for (let c = 0; c < n; c++) {
            if (x[c] === undefined) x[c] = 0;
        }

        return x;
    }

    /******************************************************************
     * Step 4 — Branch & Bound over free variables
     ******************************************************************/

    let bestSolution = null;
    let bestCost = Infinity;

    // Compute lower bound on cost for pruning
    function lbCost(partial) {
        let sum = 0;
        for (const c in partial) sum += partial[c];
        return sum;
    }

    function branch(idx, partialAssign) {
        if (idx === freeCols.length) {
            const sol = backSubstitute(partialAssign);
            if (!sol) return;

            const cost = Object.values(sol).reduce((a, b) => a + b, 0);
            if (cost < bestCost) {
                bestCost = cost;
                bestSolution = sol;
            }
            return;
        }

        const col = freeCols[idx];
        const ub = upperBound[col];

        // Lower bound pruning
        if (lbCost(partialAssign) >= bestCost) return;

        for (let v = 0; v <= ub; v++) {

            // Prune too-large partial sums
            if (lbCost(partialAssign) + v >= bestCost) break;

            const nextAssign = { ...partialAssign, [col]: v };
            branch(idx + 1, nextAssign);
        }
    }

    branch(0, {});

    return bestSolution;
}


const run2 = (machines) => machines.reduce((a, m) => {
    let A = m.joltageTargets.map((_, row) => m.buttons.map((button, col) => button.includes(row) ? 1 : 0))

    let res = solveILP(A, m.joltageTargets);
    return a + Object.values(res).reduce((a, b) => a + b, 0);
}, 0)

console.log('p2', run2(parse(input)));
