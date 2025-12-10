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

const runMachine = machine => {
    let queue = [{val: 0, steps: 0}],
        seen = {}, cur;

    while (cur = queue.shift()) {
        if (seen[cur.val]) continue;
        seen[cur.val] = cur.steps;
        if (cur.val == machine.target) break;
        machine.masks.forEach(mask => {
            queue.push({
                val: cur.val ^ mask,
                steps: cur.steps+1
            })
        })
    }

    return seen[machine.target];
}

const run = (machines) => machines.reduce((a, m) => a + runMachine(m), 0)

// recursion with aggressive branch pruning
// still very slow, runs for 1-2min
// this is actually an underconstraint linear algebra / MIP problem and should be solved by some python sci lib or Z3 instead
const runMachine2 = machine => {
    let min = Infinity;

    const pushButton = (state, button) => {
        let next = [...state];
        button.forEach(i => next[i]--);
        return next;
    };

    const solve = (state, steps, buttons) => {
        if (state.some(n => n < 0)) return;

        let stepsLeft = Math.max(...state);

        if (stepsLeft === 0) {
            min = Math.min(min, steps);
            return;
        }

        if (steps + stepsLeft >= min) return;

        // let's check if we can either prove impossibility for any 2 remaining joltages, where one is higher than the other
        // impssibility would happen if there is no button to hit the higher joltage and not hit the lower joltage (we would get below zero of the lower one)
        // additionally, if there is exactly one such button (for any of the the 2 joltages), it needs to be pressed
        for (let i = 0; i < state.length; i++) {
            for (let j = 0; j < state.length; j++) {
                if (state[i] > state[j]) {
                    let usefulButtons = buttons.filter(b => b.includes(i) && !b.includes(j));

                    if (usefulButtons.length === 0) return; // impossible to solve

                    if (usefulButtons.length === 1) {
                        solve(pushButton(state, usefulButtons[0]), steps + 1, buttons);
                        return;
                    }
                }
            }
        }

        buttons.forEach((button, i) => {
            solve(pushButton(state, button), steps + 1, buttons.slice(i));
        })
    };

    solve(machine.joltageTargets, 0, machine.buttons);

    return min;
};

const run2 = (machines) => machines.reduce((a, m) => a + runMachine2(m), 0)

console.log('p1', run(parse(input)));
console.log('p2', run2(parse(input)));
