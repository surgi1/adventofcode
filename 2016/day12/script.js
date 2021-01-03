let regs = {a: 0, b: 0, c: 1, d: 0},
    ptr = 0;

const value = v => {
    if (regs[v] !== undefined) return regs[v];
    return parseInt(v);
}

const run = line => {
    let params = line.split(' ');
    switch (params[0]) {
        case 'cpy': regs[params[2]] = value(params[1]);ptr++; break;
        case 'inc': regs[params[1]]++;ptr++; break;
        case 'dec': regs[params[1]]--;ptr++; break;
        case 'jnz': if (value(params[1]) != 0) ptr = ptr+value(params[2]); else ptr++; break;
    }
}

while (input[ptr]) {
    run(input[ptr]);
}

console.log('finished with registers', regs);