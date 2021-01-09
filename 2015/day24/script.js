// just part 2 here
// this "solution" ignores other groups, likely work only because of easy input data
// furthermore, p1 was just guessed as 79*103*107*109*113 = 10723906903
let input = [1,2,3,5,7,13,17,19,23,29,31,37,41,43,53,59,61,67,71,73,79,83,89,97,101,103,107,109,113];

let sum = input.reduce((a,b) => a+b, 0);
let groupWeight = sum/4; // per group
let groupSize = 4; // p2

console.log('sum', sum, groupWeight);

let foundMin = Math.pow(Math.max(...input), groupSize);

for (let i4 = input.length-1;i4 >= 0; i4--) {
    for (let i3 = i4-1; i3 >= 0; i3--) {
        for (let i2 = i3-1; i2 >= 0; i2--) {
            for (let i1 = i2-1; i1 >= 0; i1--) {
                if (input[i1]+input[i2]+input[i3]+input[i4] != groupWeight) continue;
                if (input[i1]*input[i2]*input[i3]*input[i4] < foundMin) {
                    foundMin = input[i1]*input[i2]*input[i3]*input[i4];
                    console.log('found new minimal entanglement', [input[i1],input[i2],input[i3],input[i4]], foundMin);
                }
            }
        }
    }
}
