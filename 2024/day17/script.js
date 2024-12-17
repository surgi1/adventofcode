Object.defineProperty(Array.prototype, 'chunk', {
    value: function(chunkSize) {
        let res = [];
        for (let i = 0; i < this.length; i += chunkSize) res.push(this.slice(i, i + chunkSize));
        return res;
    }
});

const init = input => input.match(/\d+/g).map(Number);

const run1 = (data, rega) => {
    let regs = [0,0,0];
    regs = regs.map(i => data.shift());
    if (rega !== undefined) regs[0] = rega;
    let ptr = 0;
    let program = data.chunk(2);
    let programLit = data.join(',');

    let out = [];

    const output = v => out.push(v);

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
            case 5: output(combo % 8); ptr++; break;
            case 6: regs[1] = Math.trunc(regs[0]/(2**combo)); ptr++; break;
            case 7: regs[2] = Math.trunc(regs[0]/(2**combo)); ptr++; break;
        }
    }

    return out.join(',');
}

const toOct = n => (n).toString(8);
const toDec = s => parseInt(s, 8);

// the key observation was that we need to look at the numbers in OCT radix
// ugly iterative semi-manual approach, till refactor happens
// start with empty base, see what made the best match and go from there

// also, JS is a bitch and fucks up XORs with 64-bit integers; see >>> 0 in the code

const run2 = data => {
    let program = [2,4,1,1,7,5,0,3,1,4,4,4,5,5,3,0];
    let programParsed = program.chunk(2);

    const test = a => {
        let ptr = 0, regs = [a, 0, 0], d = 0;

        while (ptr < programParsed.length) {
            let [code, op] = programParsed[ptr];
            let literal = op;
            let combo = op < 4 ? op : regs[op-4];

            switch (code) {
                case 0: regs[0] = Math.trunc(regs[0]/(2**combo)); ptr++; break;
                case 1: regs[1] = (regs[1] ^ literal) >>> 0; ptr++; break;
                case 2: regs[1] = combo % 8; ptr++; break;
                case 3: if (regs[0] != 0) ptr = literal; else ptr++; break;
                case 4: regs[1] = (regs[1] ^ regs[2]) >>> 0; ptr++; break;
                case 5: 
                    if (program[d] != (combo % 8)) {
                        return [d, 1];
                    }
                    d++;
                    ptr++;
                    break;
                case 6: regs[1] = Math.trunc(regs[0]/(2**combo)); ptr++; break;
                case 7: regs[2] = Math.trunc(regs[0]/(2**combo)); ptr++; break;
            }
        }

        return [d, 0];
    }

    let i = 0, maxd = 0, res = false;

    let base = '32756025052'; // or 7 endian
    
    for (let f = 0; f < 8; f++) for (let e = 0; e < 8; e++) for (let d = 0; d < 8; d++) for (let c = 0; c < 8; c++) for (let b = 0; b < 8; b++) for (let a = 0; a < 8; a++) {
        let oct = [e, d, c, b, a, base].join('');
        let [dig, exitCode] = test( toDec(oct) );
        if (dig >= maxd) {
            maxd = dig;
            console.log('found match up to digit', dig, ':', toDec(oct), 'oct', oct, 'exitCode', exitCode);
            if (dig == 16) return toDec(oct);
        }
    }

}

console.log('p1', run1(init(input)))
console.log('p2', run2(init(input)))