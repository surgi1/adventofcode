// just part 2
let instructions = ['addr','addi','mulr','muli','banr','bani','borr','bori','setr','seti','gtir','gtri','gtrr','eqir','eqri','eqrr'];

const parseLine = line => line.split(' ').map(i => parseInt(i))
const runInstruction = (code, params, regIn = [0,0,0,0]) => {
    let regOut = regIn.slice();
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

const decodeOpcodes = (data, op2code = []) => {
    const cmpRegs = (a,b) => a.every((v, i) => v == b[i])
    data.map(sample => sample.codeParsed = parseLine(sample.code))
    while (op2code.filter(v => v != undefined).length < instructions.length) {
        data.map(sample => {
            let matchedInstructions = 0, matchedIns = '';
            instructions.filter(code => !op2code.includes(code)).map(code => {
                if (cmpRegs(runInstruction(code, sample.codeParsed.slice(1), sample.from), sample.to)) {
                    matchedInstructions++;
                    matchedIns = code;
                }
            })
            if (matchedInstructions == 1) op2code[sample.codeParsed[0]] = matchedIns;
        })
    }
    return op2code;
}

let op2code = decodeOpcodes(data), regs = [0,0,0,0];

program.map(line => regs = runInstruction(op2code[parseLine(line)[0]], parseLine(line).slice(1), regs))

console.log('regs after program finished', regs);