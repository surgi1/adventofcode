let instructions = ['addr','addi','mulr','muli','banr','bani','borr','bori','setr','seti','gtir','gtri','gtrr','eqir','eqri','eqrr'];
let program = [], directives = [], regs = [0,0,0,0,0,0], ipRegister = false;

const runInstruction = (code, params, regIn) => {
    let regOut = regIn;
    switch (code) {
        case 'addr': regOut[params[2]] = regIn[params[0]]+regIn[params[1]]; break;
        case 'addi': regOut[params[2]] = regIn[params[0]]+params[1]; break;
        case 'mulr': regOut[params[2]] = regIn[params[0]]*regIn[params[1]]; break;
        case 'muli': regOut[params[2]] = regIn[params[0]]*params[1]; break;
        case 'setr': regOut[params[2]] = regIn[params[0]]; break;
        case 'seti': regOut[params[2]] = params[0]; break;
        case 'gtir': regOut[params[2]] = (params[0] > regIn[params[1]] ? 1 : 0); break;
        case 'gtri': regOut[params[2]] = (regIn[params[0]] > params[1] ? 1 : 0); break;
        case 'gtrr': regOut[params[2]] = (regIn[params[0]] > regIn[params[1]] ? 1 : 0); break;
        case 'eqir': regOut[params[2]] = (params[0] == regIn[params[1]] ? 1 : 0); break;
        case 'eqri': regOut[params[2]] = (regIn[params[0]] == params[1] ? 1 : 0); break;
        case 'eqrr': regOut[params[2]] = (regIn[params[0]] == regIn[params[1]] ? 1 : 0); break;
        case 'banr': regOut[params[2]] = regIn[params[0]]&regIn[params[1]]; break;
        case 'bani': regOut[params[2]] = regIn[params[0]]&params[1]; break;
        case 'borr': regOut[params[2]] = regIn[params[0]]|regIn[params[1]]; break;
        case 'bori': regOut[params[2]] = regIn[params[0]]|params[1]; break;
    }
    return regOut;
}


const runDirective = (code, params) => {
    switch (code) {
        case '#ip': ipRegister = params[0]; break;
    }
}


const readInput = () => {
    input.map(line => {
        lineParsed = line.split(' ');
        for (let i = 1; i < lineParsed.length; i++) lineParsed[i] = parseInt(lineParsed[i]);
        let params = lineParsed.slice(1);
        if (lineParsed[0] == '#ip') {
            directives.push({code: lineParsed[0], params: params});
        } else {
            program.push({code: lineParsed[0], params: params});
        }
    })
}

const cmpRegs = (a,b) => {
    let res = true;
    for (let i = 0; i < a.length; i++) {
        res = res && a[i] == b[i];
    }
    return res;
}

const init = () => {
    directives.map(dir => runDirective(dir.code, dir.params));
}

const runWithAutoIP = () => {
    program.map(line => {
        regs = runInstruction(line.code, line.params, regs);
    })
}

let timerHandle;
let ticks = 0;
let ip;

const tick = () => {
    let line = program[ip];
    regs = runInstruction(line.code, line.params, regs);
    regs[ipRegister]++;
    ip = regs[ipRegister];
    ticks++;
}

const runWithManualIP = () => {
    ip = regs[ipRegister];
    while(program[ip]) {
        let line = program[ip];
        tick();
        //if (ticks > 6290000) console.log('tick', ticks, 'last ins', line.code, line.params, 'regs', regs); // p1 debug
        let ptick = ticks % 1000000000;
        if (ptick < 200) console.log('tick', ticks, 'last ins', line.code, line.params, 'regs', regs);
        if (ptick > 999999800) console.log('tick', ticks, 'last ins', line.code, line.params, 'regs', regs);
        if (ptick == 999999999) {
            console.log('breaking after 1G ticks', regs);
            timerHandle = setTimeout(() => {runWithManualIP();}, 5000);
            break;
        }
    }
}

const run = () => {
    if (ipRegister === false) {
        console.log('running with automatic IP handling');
        runWithAutoIP()
    } else {
        console.log('running with manual IP handling', ipRegister);
        // p2
        regs[0] = 1;
        runWithManualIP();
    }
}

//readInput();
//init();
//run();

let target = 10551287;

const printDivisors = (n)  => { 
    for (let i = 1; i <= n; i++)  {
        if (n % i == 0) console.log(i);
    }
} 

printDivisors(target);

// 1+127+251+331+31877+42037+83081+10551287