let arr = input.split("\n\n");

let seeds = arr.shift().match(/\d+/g).map(Number);

let rules = arr.map(xform => {
    let tmp = xform.split("\n");
    tmp.shift();
    return tmp.map(l => l.match(/\d+/g).map(Number));
})

rules.forEach(rule => {
    rule.sort((a, b) => a[1] - b[1]);
})

//console.log(rules);

const pipe = v => {
    for (let j = 0; j < rules.length; j++) {
        let rule = rules[j];
        for (let i = 0; i < rule.length; i++) {
            let r = rule[i];
            if (v >= r[1] && v < r[1]+r[2]) {
                v = r[0]+v-r[1];
                break;
            }
        }
    }
    return v;
}

const p1 = () => seeds.map(pipe).sort((a, b) => a-b)[0];

console.log('p1', p1());

// p2 originally solved in brute force, runs for ~3s in my case; first iterate by jumps of 100 and figure out where most likely the lowest loc is, then run that range by 1.. worked ¯\_(ツ)_/¯
// current implementation jumps the ranges
const p2 = () => {
    let min = Number.POSITIVE_INFINITY;

    for (let i = 0; i < seeds.length; i += 2) {
        let seedToTest = seeds[i];

        while (seedToTest < seeds[i] + seeds[i+1]) {

            min = Math.min(min, pipe(seedToTest));

            let jump = seeds[i] + seeds[i+1] - seedToTest, v = seedToTest;
            
            rules.forEach(rule => {
                let xformed = false;

                for (let j = 0; j < rule.length; j++) {
                    let r = rule[j];
                    if (v >= r[1] && v < r[1]+r[2]) {
                        jump = Math.min(jump, r[1]+r[2]-v);
                        v = r[0]+v-r[1];
                        xformed = true;
                        break;
                    }
                }

                if (!xformed) {
                    if (v < rule[0][1]) jump = rule[0][1] - v;
                }
            })
            seedToTest += jump;
        }
    }
    console.log('p2', min);
}

const p2Brute = () => {
    let min = Number.POSITIVE_INFINITY, minSeedNr, minPairId;

    const processRange = (from, to, i, step, doPairMin = false) => {
        console.log('processing pair', i);
        let pairMin = Number.POSITIVE_INFINITY;
        let seed = from;
        if (seed < seeds[i*2]) seed = seeds[i*2];
        if (to > seeds[i*2] + seeds[i*2+1]) to = seeds[i*2] + seeds[i*2+1];
        while (seed < to) {
            let m = pipe(seed);
            if (m < min) {
                min = m;
                minSeedNr = seed;
                minPairId = i;
                //console.log('min so far', min, minSeedNr);
            }
            if (m < pairMin) pairMin = m;
            seed += step;
        }
        console.log('global min so far', min);
        if (doPairMin) console.log('pair minimum distance from global minimum', pairMin - min);
    }

    for (let i = 0; i < seeds.length/2; i++) processRange(seeds[i*2], seeds[i*2] + seeds[i*2+1], i, 100, true);

    console.log('part 2, step 2');
    processRange(minSeedNr-100, minSeedNr+100, minPairId, 1);
    console.log('p2', min);
}

console.time('cmp');
p2();
console.timeEnd('cmp')