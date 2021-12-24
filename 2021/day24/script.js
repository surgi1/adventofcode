// check input.js for some thought process

let params = [
[1, 13, 8],
[1, 12, 13],
[1, 12, 8],
[1, 10, 10],
[26, -11, 12],
[26, -13, 1],
[1, 15, 13],
[1, 10, 5],
[26, -2, 10],
[26, -6, 3],
[1, 14, 2],
[26, 0, 2],
[26, -15, 12],
[26, -4, 7]];

let solutions = [];

const advance = (z, model, par) => z*26+model+par;
const deadvanceCheck = (z, par1) => (z % 26) + par1;

const execute = modelNr => {
    let z = 0;
    for (let i = 0; i < 14; i++) {
        if (params[i][0] == 1) {
            z = advance(z, modelNr[i], params[i][2]);
        } else {
            let candidate = deadvanceCheck(z, params[i][1])
            if (candidate < 1 || candidate > 9) return false;
            modelNr[i] = candidate;
            z = Math.floor(z/26);
        }
    }
    if (z == 0) solutions.push(parseInt(modelNr.join('')));
}

const dec = digits => {
    let decPos = digits.length-1;
    while (digits[decPos] == '*') decPos--;
    digits[decPos]--;
    let i = decPos;
    while (digits[i] == 0) {
        digits[i] = 9;
        i--;
        while (digits[i] == '*') i--;
        if (i < 0) break;
        digits[i]--;
    }
    return digits;
}

let digits = [9,9,9,9,'*','*',9,9, '*', '*', 9, '*', '*', '*'];

while (digits.join('') != '1111**11**1***') {
    execute(digits.slice())
    digits = dec(digits);
}

console.log(solutions[0]);
console.log(solutions.pop());