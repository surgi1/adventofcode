let regs = {}, ptr;

const value = v => {
    if (regs[v] !== undefined) return regs[v];
    return parseInt(v);
}

const runLine = line => {
    let params = line.split(' ');
    switch (params[0]) {
        case 'cpy': regs[params[2]] = value(params[1]);ptr++; break;
        case 'inc': regs[params[1]]++;ptr++; break;
        case 'dec': regs[params[1]]--;ptr++; break;
        case 'jnz': if (value(params[1]) != 0) ptr = ptr+value(params[2]); else ptr++; break;
    }
}

const run = (regsSet = {}) => {
    regs = {a: 0, b: 0, c: 0, d: 0, ...regsSet};
    ptr = 0;
    while (input[ptr]) runLine(input[ptr]);
    return regs.a;
}

console.log('part 1', run());
console.log('part 2', run({c: 1}));