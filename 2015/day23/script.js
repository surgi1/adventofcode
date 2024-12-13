let regs = {a: 0, b: 0}, pointer = 0, program;

const runInstruction = line => {
    switch (line.instruction) {
        case 'hlf': regs[line.pars[0]] = regs[line.pars[0]] >> 1; pointer++; break;
        case 'tpl': regs[line.pars[0]] *= 3; pointer++; break;
        case 'inc': regs[line.pars[0]]++;pointer++; break;
        case 'jmp': pointer += line.pars[0]; break;
        case 'jie': if (regs[line.pars[0]] % 2 == 0) pointer += line.pars[1]; else pointer++; break;
        case 'jio': if (regs[line.pars[0]] == 1) pointer += line.pars[1]; else pointer++; break;
    }
}

const run = (regsSet = {}) => {
    regs = {a: 0, b: 0, ...regsSet}; pointer = 0;
    while (program[pointer]) runInstruction(program[pointer]);
    console.log('regs.b', regs.b);
}

program = input.map(line => ({
    instruction: line.split(' ')[0],
    pars: line.split(' ')[1].split(',').map(p => !isNaN(p) ? Number(p) : p)
}));

run();
run({a: 1});