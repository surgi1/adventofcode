// ugly and slow.. chose not to refactor from working state
// the major realization for me was an oversight in the task definition; that the message offset is taken from the *initial, untransformed* message

var part2Input = '';
var part2Copies = 10000;
var msgOffset = parseInt(input.substr(0,7));
var phases = 100;
var triv;  // from this index on the result cipher is O(n)

function phase(arr) {
    var output = [], trivsum = 0;
    for (var j = triv-1; j >= 0; j--) {
        trivsum += arr[j];
        output.push(trivsum % 10);
    }
    return output.reverse();
}

for (var i = 0; i < part2Copies; i++) {
    part2Input += input;
}
var res = part2Input.match(/\d/g), resTriv = [];

triv = Math.floor(res.length/2);

for (var i = triv; i < res.length; i++) {
    resTriv.push(parseInt(res[i]));
}

for (var i = 0; i < phases; i++) {
    resTriv = phase(resTriv);
}

var answer = '';

for (var i = msgOffset-triv; i < msgOffset-triv+8; i++) {
    answer += resTriv[i];
}

console.log(answer); // part 2
