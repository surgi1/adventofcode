// the solution for part 2 is a 2 step process
// 1. run findMagicAdepts (takes a minute) to find candidates for possible multipliers of vents.length*shapes.length
// 2. run part2Attempt with each multipliers found in the step 1 and hope for the best
// apparently I'm missing something here
// ...
// hope it helps!

Object.defineProperty(Array.prototype, 'chunk', {
    value: function(chunkSize) {
        let res = [];
        for (let i = 0; i < this.length; i += chunkSize) res.push(this.slice(i, i + chunkSize));
        return res;
    }
});

let shapes = [[[1, 1, 1, 1]],
[[0,1,0],[1,1,1],[0,1,0]],
[[1,1,1],
 [0,0,1],
 [0,0,1]], // this one is rotated to fit my interpretation
[[1], [1], [1], [1]],
[[1, 1], [1, 1]]]

const dirs = {'>': 1, '<': -1}
let vents = input.split(''), vent = 0, height = 0, shapeNr = 0, heights = [];
let pow2Lookup = Array.from({length: 10}, (v, i) => Math.pow(2, i));
let screen;

const advanceHeight = () => {
    while (screen[height] != 0) height++;
}

const getScreen = (x, y) => (screen[y] & pow2Lookup[x]) >> x;
const setScreen = (x, y) => screen[y] += pow2Lookup[x];

const advanceBrick = brick => {
    let done = false;
    while (!done) {
        let dir = dirs[vents[vent % vents.length]], canSlide = false;
        if (dir == -1) {
            canSlide = brick.shape.every((row, y) => row.every((v, x) => {
                if (v == 0) return true;
                if (brick.x-1+x < 0) return false;
                return getScreen(brick.x+x-1, brick.y+y) == 0;
            }))
            if (canSlide) brick.x--;
        } else {
            canSlide = brick.shape.every((row, y) => row.every((v, x) => {
                if (v == 0) return true;
                if (brick.x+1+x > 6) return false;
                return getScreen(brick.x+x+1, brick.y+y) == 0;
            }))
            if (canSlide) brick.x++;
        }
        vent++;

        let canFall = brick.shape.every((row, y) => row.every((v, x) => {
            if (v == 0) return true;
            if (brick.y-1+y < 0) return false;
            return getScreen(brick.x+x, brick.y-1+y) == 0;
        }))
        if (canFall) brick.y--; else done = true;
    }
    if (done) {
        brick.shape.forEach((row, y) => row.forEach((v, x) => {
            if (v == 0) return true;
            setScreen(x+brick.x, y+brick.y);
        }))
    }
    advanceHeight();
}

const newBrick = () => {
    let tmp = {
        shape: shapes[shapeNr % 5],
        x: 2,
        y: height+3
    }
    shapeNr++;
    return tmp;
}

const tick = steps => {
    let lastHeight = height;
    while (steps--) advanceBrick(newBrick());
    //console.log(height, height-lastHeight);
    heights.push(height-lastHeight);
}

const part1 = () => {
    screen = Array(5000).fill(0);
    tick(2022);
    console.log('part1', height);
}

const findMagicAdepts = () => {
    screen = Array(100000000).fill(0);
    tick(vents.length*shapes.length); // initial tick

    let i = 1200, i2 = i/2;
    while (i--) tick(vents.length*shapes.length);

    heights.shift(); // move out the first as it is not important

    const checkChunksSum = chunkSize => {
        let tmp = heights.chunk(chunkSize).map(c => c.reduce((a,v) => a+v, 0));
        if (tmp.every((v, i) => {
            if (i == tmp.length-1) return true;
            return v == tmp[0];
        })) console.log('chunkSize sums', chunkSize, tmp)
    }

    for (let n = 2; n < i2; n++) checkChunksSum(n);

}

const part2Attempt = magic => {
    screen = Array(100000000).fill(0);
    const sloni = 1000000000000;

    tick(vents.length*shapes.length); // first tick

    let offset = height;
    tick(vents.length*shapes.length*magic); // first repeatable tick
    let mult = height-offset;

    console.log(offset+mult*Math.floor(-1+sloni/(vents.length*shapes.length*magic)), 'with rocks left:', (sloni % (vents.length*shapes.length*magic))-vents.length*shapes.length)

    tick((sloni % (vents.length*shapes.length*magic))-vents.length*shapes.length) // last tick for the remainder

    console.log('attempt on p2 answer', height+mult*Math.floor(-1+sloni/(vents.length*shapes.length*magic)))
}

//part1();

//findMagicAdepts();

part2Attempt(344);  // joy!! this was found using the method above
