let states = [];

String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}

let zeroShifted = 0;

const sanitizeState = (_state) => {
    let state = _state.slice();
    if (state[0] == '#') {
        state = '...'+state;zeroShifted = zeroShifted-3;
    } else if (state[1] == '#') {
        state = '..'+state;zeroShifted = zeroShifted-2;
    } else if (state[2] == '#') {
        state = '.'+state;zeroShifted = zeroShifted-1;
    }
    if (state[state.length-1] == '#') {
        state = state+'...';
    } else if (state[state.length-2] == '#') {
        state = state+'..';
    } else if (state[state.length-3] == '#') {
        state = state+'.';
    }
    return state;
}

const getSample = (state, n) => {
    let sample = state.substr(n-2, 5);
    while (sample.length < 5) sample = sample + '.';
    return sample;
}

const tick = (oldState) => {
    let newState = '';
    for (let i = 0; i < oldState.length;i++) newState = newState+'.';
    for (let i = 2; i < oldState.length-2;i++){
        let sample = getSample(oldState, i);
        let ruleId = false;
        rules.some((rule, index) => {
            if (rule.from == sample)  {
                ruleId = index;
                return true;
            }
        })
        if (ruleId !== false) {
            newState = newState.replaceAt(i, rules[ruleId].to);
        }
    }
    return newState;
}

const computeScore = (state, zeroShifted) => {
    let score = 0;
    for (let i = 0; i < state.length; i++) {
        if (state.charAt(i) == '#') {
            score = score+i+zeroShifted;
        }
    }
    return score;
}

let state = sanitizeState(initState);
for (let i = 0; i < 300; i++) {
    state = sanitizeState(tick(state));
    console.log(state);
}
console.log('zeroShifted', zeroShifted);
console.log('final score', computeScore(state, zeroShifted));

// score after 300 generations is 15695
// it ticks another 50 with each generation
// thus the final score is 15695+50*(50000000000-300)