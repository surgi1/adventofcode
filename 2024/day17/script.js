Object.defineProperty(Array.prototype, 'chunk', {
    value: function(chunkSize) {
        let res = [];
        for (let i = 0; i < this.length; i += chunkSize) res.push(this.slice(i, i + chunkSize));
        return res;
    }
});

const init = input => input.match(/\d+/g).map(Number);

const part1 = (a, b, c, ...programFull) => {
    let ptr = 0, out = [];
    let regs = [a, b, c];
    let program = programFull.chunk(2);

    while (ptr < program.length) {
        let [code, op] = program[ptr];
        let literal = op;
        let combo = op < 4 ? op : regs[op-4];

        switch (code) {
            case 0: regs[0] = Math.trunc(regs[0]/(2**combo)); ptr++; break;
            case 1: regs[1] = (regs[1] ^ literal) >>> 0; ptr++; break;
            case 2: regs[1] = combo % 8; ptr++; break;
            case 3: if (regs[0] != 0) ptr = literal; else ptr++; break;
            case 4: regs[1] = (regs[1] ^ regs[2]) >>> 0; ptr++; break;
            case 5: out.push(combo % 8); ptr++; break;
            case 6: regs[1] = Math.trunc(regs[0]/(2**combo)); ptr++; break;
            case 7: regs[2] = Math.trunc(regs[0]/(2**combo)); ptr++; break;
        }
    }

    return out.join(',');
}

const toOct = n => (n).toString(8);
const toDec = s => parseInt(s, 8);

/*
2,4 ; regs[1] = regs[0] % 8;
1,1 ; regs[1] = regs[1] ^ 1;
7,5 ; regs[2] = Math.trunc(regs[0]/(2**regs[1]));
0,3 ; regs[0] = Math.trunc(regs[0]/8);
1,4 ; regs[1] = regs[1] ^ 4;
4,4 ; regs[1] = regs[1] ^ regs[2];
5,5 ; output(regs[1] % 8);
3,0 ; if (regs[0] != 0) ptr = 0;

while (regs[0] != 0) {
    regs[1] = (regs[0] % 8) ^ 1;
    regs[2] = regs[0] >> regs[1];
    regs[0] = regs[0] >> 3;
    regs[1] = (regs[1] ^ 4) ^ regs[2];
    output(regs[1] % 8);
}
*/

// the key observation was that we need to look at the numbers in OCT radix and that the input is generated oct num by oct num (the /8) part in the instructions
// recursive approach

// also, JS is a bitch and fucks up XORs with 64-bit integers; see >>> 0 in the code

const part2 = (a, b, c, ...programFull) => {
    let program = programFull.chunk(2);

    const test = a => {
        let ptr = 0, regs = [a, 0, 0], matches = 0;

        while (ptr < program.length) {
            let [code, op] = program[ptr];
            let literal = op;
            let combo = op < 4 ? op : regs[op-4];

            switch (code) {
                case 0: regs[0] = Math.trunc(regs[0]/(2**combo)); ptr++; break;
                case 1: regs[1] = (regs[1] ^ literal) >>> 0; ptr++; break;
                case 2: regs[1] = combo % 8; ptr++; break;
                case 3: if (regs[0] != 0) ptr = literal; else ptr++; break;
                case 4: regs[1] = (regs[1] ^ regs[2]) >>> 0; ptr++; break;
                case 5: 
                    if (programFull[matches] != (combo % 8)) return matches;
                    matches++;
                    ptr++;
                    break;
                case 6: regs[1] = Math.trunc(regs[0]/(2**combo)); ptr++; break;
                case 7: regs[2] = Math.trunc(regs[0]/(2**combo)); ptr++; break;
            }
        }

        return matches;
    }

    let min = Infinity;
    const recur = (base = '', matches = 0) => {
        if (matches == 16) {
            let dec = toDec(base);
            if (dec < min) min = dec;
            return;
        }
        for (let a = 0; a < 8; a++) {
            let oct = a+base;
            let newMatches = test(toDec(oct));
            if (newMatches > matches || (oct.length - matches) < 3) recur(oct, newMatches); // magic nr 3 comes from the way digits are tangled in the output generation; see the intcode above
        }
    }

    recur('');
    return min;
}

console.log('p1', part1(...init(input)))
console.log('p2', part2(...init(input)))