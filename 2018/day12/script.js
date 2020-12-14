//var initState = '#..#.#..##......###...###';
var initState = '##.#...#.#.#....###.#.#....##.#...##.##.###..#.##.###..####.#..##..#.##..#.......####.#.#..#....##.#';
/*var rules = [
{from:'...##',to:'#'},
{from:'..#..',to:'#'},
{from:'.#...',to:'#'},
{from:'.#.#.',to:'#'},
{from:'.#.##',to:'#'},
{from:'.##..',to:'#'},
{from:'.####',to:'#'},
{from:'#.#.#',to:'#'},
{from:'#.###',to:'#'},
{from:'##.#.',to:'#'},
{from:'##.##',to:'#'},
{from:'###..',to:'#'},
{from:'###.#',to:'#'},
{from:'####.',to:'#'}]
*/
var rules = [
{from:'#.#.#',to:'#'},
{from:'..#.#',to:'.'},
{from:'.#.##',to:'#'},
{from:'.##..',to:'.'},
{from:'##...',to:'#'},
{from:'##..#',to:'#'},
{from:'#.##.',to:'#'},
{from:'.#..#',to:'#'},
{from:'.####',to:'.'},
{from:'....#',to:'.'},
{from:'#....',to:'.'},
{from:'#.###',to:'.'},
{from:'###.#',to:'#'},
{from:'.#.#.',to:'.'},
{from:'#...#',to:'.'},
{from:'.#...',to:'#'},
{from:'##.#.',to:'#'},
{from:'#..##',to:'#'},
{from:'..##.',to:'.'},
{from:'####.',to:'#'},
{from:'.###.',to:'.'},
{from:'#####',to:'.'},
{from:'#.#..',to:'.'},
{from:'...#.',to:'.'},
{from:'..#..',to:'.'},
{from:'###..',to:'#'},
{from:'#..#.',to:'.'},
{from:'.##.#',to:'.'},
{from:'.....',to:'.'},
{from:'##.##',to:'#'},
{from:'..###',to:'#'},
{from:'...##',to:'#'}];


var states = [];

String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}

var zeroShifted = 0;

function sanitizeState(_state) {
    var state = _state.slice();
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

function getSample(state, n) {
    var sample = state.substr(n-2, 5);
    while (sample.length < 5) sample = sample + '.';
    return sample;
}

function tick(oldState) {
    var newState = '';
    for (var i = 0; i < oldState.length;i++) newState = newState+'.';
    for (var i = 2; i < oldState.length-2;i++){
        var sample = getSample(oldState, i);
        //console.log(sample);
        var ruleId = false;
        rules.some((rule, index) => {
            if (rule.from == sample)  {
                ruleId = index;
                return true;
            }
        })
        if (ruleId !== false) {
            //console.log('replacing', i, sample, rules[ruleId].to);
            newState = newState.replaceAt(i, rules[ruleId].to);
        }
    }
    return newState;
}

function computeScore(state, zeroShifted) {
    var score = 0;
    for (var i = 0; i < state.length; i++) {
        if (state.charAt(i) == '#') {
            score = score+i+zeroShifted;
        }
    }
    return score;
}

var state = sanitizeState(initState);
for (var i = 0; i < 300; i++) {
    state = sanitizeState(tick(state));
    console.log(state);
}
console.log('zeroShifted', zeroShifted);
console.log('final score', computeScore(state, zeroShifted));

// score po 300 generacich je 15695
// s kazdou dalsi generaci vzroste o 50
// finalni score je 15695+50*(50000000000-300)