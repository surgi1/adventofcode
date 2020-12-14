var input = ['#ip 4',
'seti 123 0 3',         //  i0   r3 = 123
'bani 3 456 3',         //  i1   r3 = r3 AND 456 = 72
'eqri 3 72 3',          //  i2   if r3 == 72 r3 = 1 else r3 = 0; vysledek: r3 = 1
'addr 3 4 4',           //  i3   skok na i5 (ci i4, pokud vysledek ^ je 0)
'seti 0 0 4',           //  i4   skok na i1 (endless loop pokud)
                        //      ------------------------------- konec uvodniho testu
'seti 0 5 3',           //  i5   r3 = 0
'bori 3 65536 2',       //  i6   r2 = r3 OR 65536 = 0 OR 65536
'seti 10736359 9 3',    //  i7   r3 = 10736359
'bani 2 255 1',         //  i8   r1 = r2 & 255 = 65536 & 255 = 0
'addr 3 1 3',           //  i9   r3 = r3+r1 = 10736359
'bani 3 16777215 3',    // i10   r3 = r3 & 16777215 = 10736359
'muli 3 65899 3',       // i11   r3 = r3*65899 = 707515321741
'bani 3 16777215 3',    // i12   r3 = r3 & 16777215 = 3345805
'gtir 256 2 1',         // i13   if 256 > r2 r1 = 1 else r1 = 0 |  if 256 > 65536 r1 = 1 else r1 = 0 => r1 = 0
'addr 1 4 4',           // i14   skok na r1+14+1 | skok na 15 (skocilo by na 16 kdyby ^ byla true)
'addi 4 1 4',           // i15   skok na 17
'seti 27 2 4',          // i16   skok na 28 (v prvni iteraci se neprovede)
'seti 0 3 1',           // i17   r1 = 0 // nastaveni iteratoru, nasledna smycka se provede 256-krat
'addi 1 1 5',           // i18   r5 = r1+1=1
                        //      ------------------------------ vnitrni iterator
'muli 5 256 5',         // i19   r5 = r5*256 = 256
'gtrr 5 2 5',           // i20   if r5 > r2 r5 = 1 else r5 = 0 | if 256 > 65536 | r5 = 0
'addr 5 4 4',           // i21   skok na 22 pokud ^ false, skok na 23 pokud ^ true
'addi 4 1 4',           // i22   skok na 24
'seti 25 8 4',          // i23   skok na 26 // vyskoceni ze smycky
'addi 1 1 1',           // i24   r1 = r1+1 = 1
'seti 17 6 4',          // i25   skok na 18 // skok na zacatek iteracni smycky
                        //      ------------------------------ /vnitrni iterator
'setr 1 5 2',           // i26   r2 = r1 | r2 = 256
'seti 7 7 4',           // i27   skok na i8
'eqrr 3 0 1',           // i28   if r3 == r0 r1 = 1;END; else r1 = 0;skok na i6
                        //      ------------------------------ nize je omacka
'addr 1 4 4',           // i29   pokud r1 > 0 END
'seti 5 1 4']           // i30   skok na i6

var instructions = ['addr','addi','mulr','muli','banr','bani','borr','bori','setr','seti','gtir','gtri','gtrr','eqir','eqri','eqrr'];
var program = [], directives = [], regs = [0,0,0,0,0,0], ipRegister = false;

function runInstruction(code, params, regIn) {
    //if (regIn == undefined) regIn = [0,0,0,0,0,0];
    //var regOut = $.extend(true, [], regIn);
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

function tick(verbose) {
    var line = program[ip];
    regs = runInstruction(line.code, line.params, regs);
    regs[ipRegister]++;
    ip = regs[ipRegister];
    ticks++;
    if (verbose === true) console.log('tick', ticks, 'last ins', line.code, line.params, 'regs', regs);
}

var lastComparableR3 = 0;

function runWithManualIP() {
    ip = regs[ipRegister];
    var handBraked = false;
    while(program[ip]) {
        var line = program[ip];
        tick();
        if (line.code == 'eqrr') {
            //if (!distinctR3values.includes(regs[3])) distinctR3values.push(regs[3]);
            lastComparableR3 = regs[3];
        }
        //if (ip == 27) console.log('r2 po i26', regs[2]);
        //if (ip == 13) console.log('r3 po i12', regs[2]);
        var ptick = ticks % 1000000000;
        //if (ptick < 2000) console.log('tick', ticks, 'last ins', line.code, line.params, 'regs', regs, 'last working r3', lastComparableR3);
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
// p2: 149 is too low
// p2 latest found 11813057