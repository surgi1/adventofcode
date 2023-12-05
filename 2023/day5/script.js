let arr = input.split("\n\n");

let seeds = arr.shift().match(/\d+/g).map(Number);

let rules = arr.map(xform => {
    let tmp = xform.split("\n");
    tmp.shift();
    return tmp.map(l => l.match(/\d+/g).map(Number));
})

const pipe = v => {
    rules.forEach(rule => rule.some(r => {
        if (v >= r[1] && v < r[1]+r[2]) {
            v = r[0]+v-r[1];
            return true;
        }
    }))
    return v;
}

const p1 = () => seeds.map(pipe).sort((a, b) => a-b)[0];

console.log('p1', p1());

// p2 solved in very dummy approach; first iterate by jumps of 10 and figure out where most likely the lowest loc is, then run that range by 1.. worked ¯\_(ツ)_/¯
// TBD revisit and solve in generic, faster and overall better fashion
const p2 = () => {
    let min = 100000000000, minSeedNr, minPairId;

    const processRange = (i, step) => {
        console.log('processing pair', i);
        let seed = seeds[i*2];
        while (seed < seeds[i*2] + seeds[i*2+1]) {
            let m = pipe(seed);
            if (m < min) {
                min = m;
                minSeedNr = seed;
                minPairId = i;
                console.log('min so far', min, minSeedNr);
            }
            seed += step;
        }
    }

    for (let i = 0; i < seeds.length/2; i++) processRange(i, 10);

    console.log('part 2, step 2');
    processRange(minPairId, 1);
}

p2();