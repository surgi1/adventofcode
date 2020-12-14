var instructions = ['addr','addi','mulr','muli','banr','bani','borr','bori','setr','seti','gtir','gtri','gtrr','eqir','eqri','eqrr'];

function runInstruction(code, params, regIn) {
    if (regIn == undefined) regIn = [0,0,0,0];
    var regOut = $.extend(true, [], regIn);
    switch (code) {
        case 'addr': regOut[params[2]] = regIn[params[0]]+regIn[params[1]]; break;
        case 'addi': regOut[params[2]] = regIn[params[0]]+params[1]; break;
        case 'mulr': regOut[params[2]] = regIn[params[0]]*regIn[params[1]]; break;
        case 'muli': regOut[params[2]] = regIn[params[0]]*params[1]; break;
        case 'banr': regOut[params[2]] = regIn[params[0]]&regIn[params[1]]; break;
        case 'bani': regOut[params[2]] = regIn[params[0]]&params[1]; break;
        case 'borr': regOut[params[2]] = regIn[params[0]]|regIn[params[1]]; break;
        case 'bori': regOut[params[2]] = regIn[params[0]]|params[1]; break;
        case 'setr': regOut[params[2]] = regIn[params[0]]; break;
        case 'seti': regOut[params[2]] = params[0]; break;
        case 'gtir': regOut[params[2]] = (params[0] > regIn[params[1]] ? 1 : 0); break;
        case 'gtri': regOut[params[2]] = (regIn[params[0]] > params[1] ? 1 : 0); break;
        case 'gtrr': regOut[params[2]] = (regIn[params[0]] > regIn[params[1]] ? 1 : 0); break;
        case 'eqir': regOut[params[2]] = (params[0] == regIn[params[1]] ? 1 : 0); break;
        case 'eqri': regOut[params[2]] = (regIn[params[0]] == params[1] ? 1 : 0); break;
        case 'eqrr': regOut[params[2]] = (regIn[params[0]] == regIn[params[1]] ? 1 : 0); break;
    }
    return regOut;
}

function cmpRegs(a,b) {
    var res = true;
    for (var i = 0; i < 4; i++) {
        res = res && a[i] == b[i];
    }
    return res;
}

//var foundThreePluses = 0;

data.map(sample => {
    sample.codeParsed = sample.code.split(' ').map(i => i = parseInt(i));
})


var opcodes = {}, foundOpcodes = 0, opcode2code = {};

while (foundOpcodes < instructions.length) {
    data.map(sample => {
        var matchedInstructions = 0, matchedIns = '';
        instructions.map(code => {
            if (!opcodes[code]) {
                var output = runInstruction(code, sample.codeParsed.slice(1), sample.from);
                if (cmpRegs(output, sample.to)) {
                    matchedInstructions++;
                    matchedIns = code;
                }
            }
        })
        if (matchedInstructions == 1) {
            //console.log('opcode', sample.codeParsed[0], 'is instruction', matchedIns);
            if (!opcodes[matchedIns]) {
                opcodes[matchedIns] = {opcode: sample.codeParsed[0]};
                opcode2code[sample.codeParsed[0]] = matchedIns;
                foundOpcodes++;
            }
        }
    })
}

//console.log('identified sets that can be output of 3 or more instructions', foundThreePluses);

//console.log(data);
console.log(opcode2code);

var regs = [0,0,0,0];

program.map(line => {
    lineParsed = line.split(' ').map(i => i = parseInt(i));
    regs = runInstruction(opcode2code[lineParsed[0]], lineParsed.slice(1), regs)
})

console.log('regs after program finished', regs);