let busId = 1002461;
let departs = [29,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,41,0,0,0,0,0,0,0,0,0,521,0,0,0,0,0,0,0,23,0,0,0,0,13,0,0,0,17,0,0,0,0,0,0,0,0,0,0,0,0,0,601,0,0,0,0,0,37,0,0,0,0,0,0,0,0,0,0,0,0,19];

// p1
/*
let min = busId*Math.max(...departs);
let foundDepart = -1;

departs.map((d, index) => {
    if (d != 0) {
        let dp = d*Math.ceil(busId/d)-busId;
        if (dp < min) {
            min = dp;
            foundDepart = d;
        }
    }
})

console.log('result', min, foundDepart, min*foundDepart);
*/

let inputDeparts = [], inputMinutes = [];

departs.map((d, index) => {
    if (d > 0) {
        inputDeparts.push(d);
        inputMinutes.push(index);
    }
})

let maxDepartId = inputDeparts.indexOf(Math.max(...inputDeparts));
console.log(maxDepartId);

let len = inputMinutes.length;
/*
// ugly brute-force part 2
// completed in finite time and found correct answer, ahem..
// keeping this in with hopes to never repeat the approach

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

// a much more elegant part 2 solution

let tempTimeStamp = 1;
let multiplicator = 1;

for (let i = 0; i < len;i++) {
    console.log('solving bus nr ', i, 'timestamp', tempTimeStamp, 'multiplicator', multiplicator);
    let exit = false;
    while (!exit) {
        if((tempTimeStamp + inputMinutes[i]) % inputDeparts[i] === 0){
            exit = true;
            multiplicator *= inputDeparts[i];
        } else {
            tempTimeStamp +=  multiplicator; 
        }
    }

}

console.log('resulting timestamp', tempTimeStamp);

console.log('inputDeparts', inputDeparts);
console.log('inputMinutes', inputMinutes);

/*
bruteforced p2:
breaking after 1207 ticks last checked timestamp 725.407 B
found one! 1207737579535 725850285300475
*/