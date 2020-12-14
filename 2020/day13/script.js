var busId = 939;var departs = [7,13,0,0,59,0,31,19]; // 0 = x
var departs = [7, 13, 0, 0, 59];
//var busId = 1002461;var departs = [29,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,41,0,0,0,0,0,0,0,0,0,521,0,0,0,0,0,0,0,23,0,0,0,0,13,0,0,0,17,0,0,0,0,0,0,0,0,0,0,0,0,0,601,0,0,0,0,0,37,0,0,0,0,0,0,0,0,0,0,0,0,19];

// p1
/*
var min = busId*Math.max(...departs);
var foundDepart = -1;

departs.map((d, index) => {
    if (d != 0) {
        console.log('***', d*Math.ceil(busId/d));
        var dp = d*Math.ceil(busId/d)-busId;
        if (dp < min) {
            min = dp;
            foundDepart = d;
        }
    }
})

console.log('result', min, foundDepart, min*foundDepart);
*/

var inputDeparts = [], inputMinutes = [];

departs.map((d, index) => {
    if (d > 0) {
        inputDeparts.push(d);
        inputMinutes.push(index);
    }
})

var maxDepartId = inputDeparts.indexOf(Math.max(...inputDeparts));
console.log(maxDepartId);

var len = inputMinutes.length;
/*
var found = false;
var i = 1;
var timerHandle;

function tick() {

    while (!found) {
        var tCandidate = i*inputDeparts[maxDepartId];
        var validCandidate = true;
        for (var index = 0; index < len; index++) {
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

function timedTick() {
    console.time('tick run');
    tick();
    console.timeEnd('tick run');
}

timedTick();
*/

// vyrazne hezci inspirovane reseni

var tempTimeStamp = 1;
var multiplicator = 1;

for (var i = 0; i < len;i++) {
    console.log('solving bus nr ', i, 'timestamp', tempTimeStamp, 'multiplicator', multiplicator);
    var exit = false;
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
handbreaking after 1207 ticks last checked timestamp 725.407 B
found one! 1207737579535 725850285300475
*/