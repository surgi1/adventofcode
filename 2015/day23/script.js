let regs = {a:1,b:0}, pointer = 0, program = [], ticks = 0;

const readInput = () => {
    input.map(line => {
        let arr = line.split(' ');
        let pars = arr[1].split(',');
        pars.map((p,i) => {
            if (!isNaN(p)) pars[i] = parseInt(p);
        })
        program.push({
            instruction: arr[0],
            pars: pars
        })
    })
}

const runInstruction = (line) => {
    switch (line.instruction) {
        case 'hlf': regs[line.pars[0]] = regs[line.pars[0]] >> 1; pointer++; break;
        case 'tpl': regs[line.pars[0]] *= 3; pointer++; break;
        case 'inc': regs[line.pars[0]]++;pointer++; break;
        case 'jmp': pointer += line.pars[0]; break;
        case 'jie': if (regs[line.pars[0]] % 2 == 0) pointer += line.pars[1]; else pointer++; break;
        case 'jio': if (regs[line.pars[0]] == 1) pointer += line.pars[1]; else pointer++; break;
    }
}

const run = () => {
    while(program[pointer]) {
        runInstruction(program[pointer]);
        ticks++;
    }
    console.log('ticks', ticks, 'regs', regs);
}

readInput();
run();