// ugly and slow.. chose not to refactor from working state
// the major realization for me was an oversight in the task definition; that the message offset is taken from the *initial, untransformed* message

let part2Input = '';
let part2Copies = 10000;
let msgOffset = parseInt(input.substr(0,7));
let phases = 100;
let triv;  // from this index on the result cipher is O(n)

const phase = arr => {
    let output = [], trivsum = 0;
    for (let j = triv-1; j >= 0; j--) {
        trivsum += arr[j];
        output.push(trivsum % 10);
    }
    return output.reverse();
}

for (let i = 0; i < part2Copies; i++) {
    part2Input += input;
}
let res = part2Input.match(/\d/g), resTriv = [];

triv = Math.floor(res.length/2);

for (let i = triv; i < res.length; i++) {
    resTriv.push(parseInt(res[i]));
}

for (let i = 0; i < phases; i++) {
    resTriv = phase(resTriv);
}

let answer = '';

for (let i = msgOffset-triv; i < msgOffset-triv+8; i++) {
    answer += resTriv[i];
}

console.log(answer); // part 2
