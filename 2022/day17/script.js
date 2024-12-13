Object.defineProperty(Array.prototype, 'chunk', {
    value: function(chunkSize) {
        let res = [];
        for (let i = 0; i < this.length; i += chunkSize) res.push(this.slice(i, i + chunkSize));
        return res;
    }
});

const shapes = [
    [[1, 1, 1, 1]],
    [[0,1,0], [1,1,1], [0,1,0]],
    [[1,1,1], [0,0,1], [0,0,1]], // this one is rotated to fit my interpretation
    [[1], [1], [1], [1]],
    [[1, 1], [1, 1]] ]

const p1Ticks = 2022, sequenceSkimTicks = 50000, eleDemand = 1e12;
const dirs = {'>': 1, '<': -1}
let vents = input.split(''), vent = 0; height = 0; shapeNr = 0; heights = []; screen = [];
let pow2Lookup = Array.from({length: 10}, (v, i) => Math.pow(2, i));

const getScreen = (x, y) => (screen[y] & pow2Lookup[x]) >> x;
const setScreen = (x, y) => screen[y] += pow2Lookup[x];

const dropBrick = () => {
    while (screen.length <= height+6) screen.push(0);
    let brick = {
        shape: shapes[(shapeNr++) % 5],
        x: 2,
        y: height+3
    }

    while (true) {
        let dir = dirs[vents[(vent++) % vents.length]];

        if (brick.shape.every((r, y) => r.every((v, x) => {
                if (v == 0) return true;
                if (dir == -1 && brick.x+dir+x < 0) return false;
                if (dir ==  1 && brick.x+dir+x > 6) return false;
                return getScreen(brick.x+dir+x, brick.y+y) == 0;
            }))) brick.x += dir;

        if (brick.shape.every((r, y) => r.every((v, x) => {
                if (v == 0) return true;
                if (brick.y+y < 1) return false;
                return getScreen(brick.x+x, brick.y-1+y) == 0;
            }))) brick.y--;
        else break;
    }

    brick.shape.forEach((r, y) => r.forEach((v, x) => v && setScreen(x+brick.x, y+brick.y)))
    
    while (screen[height] != 0) height++;
}

const tick = steps => {
    let lastHeight = height;
    while (steps--) dropBrick();
    return heights.push(height-lastHeight);
}

const findSequence = (res = false) => {
    const checkChunksSum = chunkSize => {
        let tmp = heights.chunk(chunkSize).map(c => c.reduce((a,v) => a+v, 0));
        return (tmp.length > 5 && tmp.every((v, i) => {
            if (i == tmp.length-1) return true;
            return v == tmp[0];
        }))
    }

    tick(p1Ticks);
    console.log(heights.shift()); // get out the first as it from the initial p1 tick

    let i = sequenceSkimTicks, i2 = i/4;
    while (i--) tick(1);

    for (let n = 30; n < i2; n++) if (checkChunksSum(n)) return n;
}

const part2 = step => {
    const fst = p1Ticks+sequenceSkimTicks, offset = height;

    tick(step); // first repeatable tick
    let mult = height-offset;

    tick(((eleDemand-fst-step) % step)) // last tick for the remainder
    return height+mult*Math.floor((eleDemand-fst)/step-1);
}

console.log(part2(findSequence()));
