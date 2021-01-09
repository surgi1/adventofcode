let busId = 1002461;
let departs = [29,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,41,0,0,0,0,0,0,0,0,0,521,0,0,0,0,0,0,0,23,0,0,0,0,13,0,0,0,17,0,0,0,0,0,0,0,0,0,0,0,0,0,601,0,0,0,0,0,37,0,0,0,0,0,0,0,0,0,0,0,0,19];

// p1
let min = busId*Math.max(...departs), foundDepart = -1;

departs.map((d, index) => {
    if (d != 0) {
        let dp = d*Math.ceil(busId/d)-busId;
        if (dp < min) {
            min = dp;
            foundDepart = d;
        }
    }
})
console.log('part 1', min*foundDepart);

// p2
let inputDeparts = [], inputMinutes = [], tempTimeStamp = 1, multiplicator = 1;

departs.map((d, index) => {
    if (d > 0) {
        inputDeparts.push(d);
        inputMinutes.push(index);
    }
})

for (let i = 0; i < inputMinutes.length; i++) {
    //console.log('solving bus nr ', i, 'timestamp', tempTimeStamp, 'multiplicator', multiplicator);
    while (true) {
        if ((tempTimeStamp + inputMinutes[i]) % inputDeparts[i] == 0) {
            multiplicator *= inputDeparts[i];
            break;
        }
        tempTimeStamp +=  multiplicator;
    }
}

console.log('part 2', tempTimeStamp);

/*
// ugly brute-force part 2
// completed in finite time and found correct answer, ahem..
// keeping this in with hopes to never repeat the approach

let maxDepartId = inputDeparts.indexOf(Math.max(...inputDeparts));
let len = inputMinutes.length;
let found = false;
let i = 1;
let timerHandle;

const tick = () => {

    while (!found) {
        let tCandidate = i*inputDeparts[maxDepartId];
        let validCandidate = true;
        for (let index = 0; index < len; index++) {
            if (index == maxDepartId) continue;
            if (((tCandidate-(inputMinutes[maxDepartId] - inputMinutes[index])) % inputDeparts[index]) > 0) {
                validCandidate = false;
                break;
            }
        }
        if (i % 1000000000 == 0) {
             console.log('handbreaking after', i/1000000000, 'ticks', 'last checked timestamp', tCandidate/1000000000000, 'B');
             timerHandle = setTimeout(() => timedTick(), 5000);
             i++;
             break;
        }
        if (validCandidate) {
            found = true;
            console.log('found one!', i, tCandidate-(inputMinutes[maxDepartId] - inputMinutes[0]));
        }
        i++;
    }

}

const timedTick = () => {
    console.time('tick run');
    tick();
    console.timeEnd('tick run');
}

timedTick();
*/
