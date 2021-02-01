let dimensions, tab3 = [], i2vect = [], state;
const key = p => p.join('_');
const setPoint = (p, val) => state[key(p)] = val;
const getCount = map => Object.values(map).length;
const getPoint = (map, p) => map[key(p)] ? map[key(p)] : false
const initVect = val => new Array(dimensions).fill(0).map((e, i) => val[i] ? val[i] : 0)
const init = input => input.map((line, y) => line.split('').map((v, x) => setPoint(initVect([x,y]), v == '#')))

const getAdjacentLights = (map, p, count = 0) => {
    for (let i = 0; i < tab3[dimensions]; i++) {
        let vect = [];
        if (i2vect[i]) vect = i2vect[i].slice(); else { 
            for (let n = 0; n < dimensions; n++) vect[n] = (Math.floor(i/tab3[n]) % 3)-1;
            i2vect[i] = vect.slice();
        }
        if (vect.every(e => e == 0)) continue;
        for (let n = 0; n < dimensions; n++) vect[n] += p[n];
        if (map[key(vect)]) count++;
    }
    return count;
}

const getActiveBox = map => {
    let min = [], max = [], extSize = [];
    Object.keys(map).filter(k => map[k] !== false).map(k => {
        k.split('_').map(n => parseInt(n)).map((v, index) => {
            if ((min[index] == undefined) || v < min[index]) min[index] = v;
            if ((max[index] == undefined) || v > max[index]) max[index] = v;
            extSize[index] = Math.abs(max[index]-min[index])+3;
        })
    })
    return {min:min, max:max, extSize: extSize}
}

const advanceState = lastState => {
    state = {};
    let box = getActiveBox(lastState), tab = [];
    for (let n = 0; n <= dimensions; n++) tab[n] = n == 0 ? 1 : tab[n-1]*box.extSize[n-1];
    for (let i = 0; i < tab[dimensions]; i++) {
        let vect = [];
        for (let n = 0; n < dimensions; n++) vect[n] = (Math.floor(i/tab[n]) % box.extSize[n])+box.min[n]-1;
        let lights = getAdjacentLights(lastState, vect);
        if (getPoint(lastState, vect) === true) {
            if (lights == 3 || lights == 2) setPoint(vect, true);
        } else {
            if (lights == 3) setPoint(vect, true);
        }
    }
};

const gameOfLife = (input, setDimensions, steps = 6) => {
    dimensions = setDimensions;
    i2vect = []; state = {};
    for (let n = 0; n <= dimensions; n++) tab3[n] = Math.pow(3, n);
    init(input);
    for (let y = 0; y < steps; y++) advanceState(state);
    return getCount(state);
}

for (let i = 2; i < 6; i++) console.log('part '+(i-2)+' ('+i+'D)', gameOfLife(input, i));