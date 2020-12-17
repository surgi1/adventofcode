var combinations = [];
var amplifiers = [];
var highestOutputFound = 0;

function genCombinations(used, available) {
    if (available.length == 1) {
        used.push(available[0]);
        combinations.push(used);
    } else {
        available.map((n,i) => {
            var newUsed = used.slice(), newAvailable = available.slice();
            newUsed.push(n);
            newAvailable.splice(i, 1);
            genCombinations(newUsed, newAvailable);
        })
    }
}

function runRelay(serie) {
    console.log('running serie', serie);
    var signal = 0, result;
    for (var i = 0; i < 5; i++) {
        var amp = amplifiers[i];
        amp.reset();
        result = amp.run([serie[i], signal]);
        signal = result.output;
    }
    if (signal > highestOutputFound) {
        highestOutputFound = signal;
        console.log('new highest output found', signal);
    }
}

function runLooped(serie) {
    console.log('running serie', serie);
    for (var i = 0; i < 5; i++) {
        amplifiers[i].reset();
    }
    var signal = 0;
    var loop = 0;
    var result;
    var stop = false;
    while (!stop) {
        for (var i = 0; i < 5; i++) {
            var amp = amplifiers[i];
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

function part1() {
    genCombinations([], [0,1,2,3,4]);

    for (var i = 0; i < 5; i++) {
        var amp = new Computer();
        amp.load(input);
        amplifiers.push(amp);
    }

    combinations.map(serie => runRelay(serie));
    console.log('finished with highestOutputFound', highestOutputFound);
}

function part2() {
    genCombinations([], [5,6,7,8,9]);

    for (var i = 0; i < 5; i++) {
        var amp = new Computer();
        amp.load(input);
        amplifiers.push(amp);
    }

    combinations.map(serie => runLooped(serie));
    console.log('finished with highestOutputFound', highestOutputFound);
}


//part1();
part2();
