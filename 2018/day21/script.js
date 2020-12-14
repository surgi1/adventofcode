// this worked just for phase 1
// for phase 2 of the puzzle, see program.js

var instructions = ['addr','addi','mulr','muli','banr','bani','borr','bori','setr','seti','gtir','gtri','gtrr','eqir','eqri','eqrr'];
var program = [], directives = [], regs = [0,0,0,0,0,0], ipRegister = false;

function runInstruction(code, params, regIn) {
    var regOut = regIn;
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

function runDirective(code, params) {
    switch (code) {
        case '#ip': ipRegister = params[0]; break;
    }
}

function readInput() {
    input.map(line => {
        lineParsed = line.split(' ');
        for (var i = 1; i < lineParsed.length; i++) lineParsed[i] = parseInt(lineParsed[i]);
        var params = lineParsed.slice(1);
        if (lineParsed[0] == '#ip') {
            directives.push({code: lineParsed[0], params: params});
        } else {
            program.push({code: lineParsed[0], params: params});
        }
    })
}

function cmpRegs(a,b) {
    var res = true;
    for (var i = 0; i < a.length; i++) {
        res = res && a[i] == b[i];
    }
    return res;
}

function init() {
    directives.map(dir => runDirective(dir.code, dir.params));
}

function runWithAutoIP() {
    program.map(line => {
        regs = runInstruction(line.code, line.params, regs);
    })
}

var timerHandle;
var ticks = 0;
var ip;

var distinctR3values = [];

function tick() {
    var line = program[ip];
    regs = runInstruction(line.code, line.params, regs);
    regs[ipRegister]++;
    ip = regs[ipRegister];
    ticks++;
}

var lastComparableR3 = 0;

function runWithManualIP() {
    ip = regs[ipRegister];
    var handBraked = false;
    while(program[ip]) {
        var line = program[ip];
        tick();
        if (line.code == 'eqrr') {
            lastComparableR3 = regs[3];
        }
        var ptick = ticks % 1000000000;
        if (ptick > 999999980) console.log('tick', ticks, 'last ins', line.code, line.params, 'regs', regs, 'last working r3', lastComparableR3);
        if (ptick == 999999999) {
            console.log('breaking after 1G ticks', regs);
            timerHandle = setTimeout(() => {runWithManualIP();}, 5000);
            handBraked = true;
            break;
        }
    }
    if (!handBraked) console.log('END tick', ticks, 'last ins', line.code, line.params, 'regs', regs, 'dist r3', 'last working r3', lastComparableR3);
}

function run() {
    if (ipRegister === false) {
        console.log('running with automatic IP handling');
        runWithAutoIP()
    } else {
        console.log('running with manual IP handling', ipRegister);
        // p2
        regs[0] = 16311888;
        regs[0] = 149;
        regs[0] = 11237061;
        runWithManualIP();
    }
}

readInput();
init();
run();
// 16311888 correct p1
// p2 latest found 11813057