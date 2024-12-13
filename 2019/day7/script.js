let combinations = [];
let amplifiers = [];
let highestOutputFound = 0;

const genCombinations = (used, available) => {
    if (available.length == 1) {
        used.push(available[0]);
        combinations.push(used);
    } else {
        available.map((n,i) => {
            let newUsed = used.slice(), newAvailable = available.slice();
            newUsed.push(n);
            newAvailable.splice(i, 1);
            genCombinations(newUsed, newAvailable);
        })
    }
}

const runRelay = serie => {
    console.log('running serie', serie);
    let signal = 0, result;
    for (let i = 0; i < 5; i++) {
        let amp = amplifiers[i];
        amp.reset();
        result = amp.run([serie[i], signal]);
        signal = result.output;
    }
    if (signal > highestOutputFound) {
        highestOutputFound = signal;
        console.log('new highest output found', signal);
    }
}

const runLooped = serie => {
    console.log('running serie', serie);
    for (let i = 0; i < 5; i++) {
        amplifiers[i].reset();
    }
    let signal = 0;
    let loop = 0;
    let result;
    let stop = false;
    while (!stop) {
        for (let i = 0; i < 5; i++) {
            let amp = amplifiers[i];
            if (loop == 0) {
                result = amp.run([serie[i], signal]);
                signal = result.output;
            } else {
                result = amp.run([signal]);
                signal = result.output;
                if (result.code == 1) {
                    console.log('loop for serie ended for machine', i, 'loop', loop, 'signal', signal);
                    stop = true;
                }
            }
        }
        loop++;
    }
    if (signal > highestOutputFound) {
        highestOutputFound = signal;
        console.log('new highest output found', signal);
    }
}

const part1 = () => {
    genCombinations([], [0,1,2,3,4]);

    for (let i = 0; i < 5; i++) {
        let amp = new Computer();
        amp.load(input);
        amplifiers.push(amp);
    }

    combinations.map(serie => runRelay(serie));
    console.log('finished with highestOutputFound', highestOutputFound);
}

const part2 = () => {
    genCombinations([], [5,6,7,8,9]);

    for (let i = 0; i < 5; i++) {
        let amp = new Computer();
        amp.load(input);
        amplifiers.push(amp);
    }

    combinations.map(serie => runLooped(serie));
    console.log('finished with highestOutputFound', highestOutputFound);
}


//part1();
part2();
