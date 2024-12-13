// brute-force, as usual, part2 takes some serious time (3.5Gticks)
let regs = {}, ptr = 0, program = [];

const value = v => {
    if (regs[v] !== undefined) return regs[v];
    return parseInt(v);
}

const init = (input, regsSet) => {
    program = [];
    ptr = 0;
    regs = {a: 0, b: 0, c: 0, d: 0, ...regsSet};
    input.map(line => program.push(line.split(' ')));
}

const runLine = params => {
    switch (params[0]) {
        case 'cpy': if (regs[params[2]] !== undefined) regs[params[2]] = value(params[1]);ptr++; break;
        case 'inc': if (regs[params[1]] !== undefined) regs[params[1]]++;ptr++; break;
        case 'dec': if (regs[params[1]] !== undefined) regs[params[1]]--;ptr++; break;
        case 'jnz': if (value(params[1]) != 0) ptr = ptr+value(params[2]); else ptr++; break;
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

const run = (regsSet = {}) => {
    init(input, regsSet);

    let ticks = 0;
    while (program[ptr]) {
        runLine(program[ptr]);
        ticks++;
        if (ticks % 10000000 == 0) console.log('Mticks', ticks/1000000, regs);
    }

    console.log('finished with registers', regs);
}

run({a: 7});
run({a: 12});