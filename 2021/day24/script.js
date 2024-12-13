// check input.js for some thought process

// these are derived from your pseudo-code (puzzle input)
let params = [
    [ 1,  13,  8],
    [ 1,  12, 13],
    [ 1,  12,  8],
    [ 1,  10, 10],
    [26, -11, 12],
    [26, -13,  1],
    [ 1,  15, 13],
    [ 1,  10,  5],
    [26,  -2, 10],
    [26,  -6,  3],
    [ 1,  14,  2],
    [26,   0,  2],
    [26, -15, 12],
    [26,  -4,  7]];

let solutions = [];

const advance = (z, model, par) => z*26+model+par;
const deadvanceCheck = (z, par1) => (z % 26) + par1;

const execute = modelNr => {
    let z = 0;
    for (let i = 0; i < 14; i++) {
        if (params[i][0] == 1) {
            z = advance(z, modelNr[i], params[i][2]);
        } else {
            modelNr[i] = deadvanceCheck(z, params[i][1])
            if (modelNr[i] < 1 || modelNr[i] > 9) return false;
            z = Math.floor(z/26);
        }
    }
    if (z == 0) solutions.push(parseInt(modelNr.join('')));
}

const dec = (digits, decPos = digits.length-1) => {
    while (digits[decPos] == '*') decPos--;
    if (decPos < 0) return;
    digits[decPos]--;
    if (digits[decPos] == 0) {
        digits[decPos] = 9;
        dec(digits, decPos-1);
    }
}

let digits = params.map(p => p[0] == 1 ? 9 : '*'),
    finDigits = params.map(p => p[0] == 1 ? 1 : '*').join('');

while (digits.join('') != finDigits) {
    execute(digits.slice());
    dec(digits);
}

console.log(solutions[0]);
console.log(solutions.pop());