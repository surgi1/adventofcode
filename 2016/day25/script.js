let regs = {a: 0, b: 0, c: 0, d: 0}, ptr = 0, program = [], output = [];

const value = v => {
    if (regs[v] !== undefined) return regs[v];
    return parseInt(v);
}

const init = input => input.map(line => program.push(line.split(' ')));

const run = params => {
    switch (params[0]) {
        case 'cpy': if (regs[params[2]] !== undefined) regs[params[2]] = value(params[1]);ptr++; break;
        case 'inc': if (regs[params[1]] !== undefined) regs[params[1]]++;ptr++; break;
        case 'dec': if (regs[params[1]] !== undefined) regs[params[1]]--;ptr++; break;
        case 'jnz': if (value(params[1]) != 0) ptr = ptr+value(params[2]); else ptr++; break;
        case 'out': output.push(value(params[1]));ptr++; break;
        case 'tgl':
            let tglIndex = ptr+value(params[1]);
            if (program[tglIndex]) {
                let tglLine = program[tglIndex];
                if (tglLine.length == 2) {
                    if (tglLine[0] == 'inc') tglLine[0] = 'dec'; else tglLine[0] = 'inc';
                } else if (tglLine.length == 3) {
                    if (tglLine[0] == 'jnz') tglLine[0] = 'cpy'; else tglLine[0] = 'jnz';
                }
                program[tglIndex][0] = tglLine[0] // seems safe ;)
            }
            ptr++;
            break;
    }
}

const reset = () => {
    regs = {a: 0, b: 0, c: 0, d: 0};
    ptr = 0;
    output = [];    
}

init(input);

let a = 1, stop = false;

while (!stop) {
    let ticks = 0;
    reset();
    regs.a = a;
    while (program[ptr]) {
        run(program[ptr]);
        ticks++;
        let len = output.length;
        if (len > 1 && len % 2 == 0) {
            if (output[len-2] != '0' || output[len-1] != '1') {
                a++;
                break;
            }
        }
        if (ticks % 1000000 == 0) {
            console.log('Not failed and reached a Mtick, lets call it a day; reg A', a);
            stop = true;
            break;
        }
    }
}
