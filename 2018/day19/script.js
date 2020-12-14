var input = ['#ip 4',
'addi 4 16 4',// i:0  | velky odskok na instukci 17
'seti 1 4 3', // i:1  | nastavi [3] (pomaly iterator) na 1, init slow loopu
'seti 1 3 5', // i:2  | nastavi [5] (rychly iterator) na 1, init fast loopu
'mulr 3 5 1', // i:3  | [1] = pomaly iter * rychly iter
'eqrr 1 2 1', // i:4  | pokud pomaly iterator * rychly iterator == cile iteratoru, nastav pres i:7 pricti cislo (uff)
'addr 1 4 4', //        
'addi 4 1 4', //        
'addr 3 0 0', // i:7  | prida obsah [3] (pomaly iterator) do [0] <-- zakopany pes je zde ~a ve 2 radcich ^~ (z tech to neni!)
'addi 5 1 5', // i:8    maly iterator++
'gtrr 5 2 1', // i:9    ukoncovaci podminka maleho iteratoru
'addr 4 1 4', // i:10 | pokud maly iter doiteroval, preskoc na i:12, jinak zpet na i:3
'seti 2 9 4', // odskok na i:3
'addi 3 1 3', // i:12 | velky iterator++
'gtrr 3 2 1', // i:13 | pokud je [3] > [2] => [1]=1, jinak [1]=0, ukoncovaci podminka velkeho iteratoru (pokud velky iter doiteroval => END, jinak i:2)
'addr 1 4 4', // i:14 | pokud je [1]=0, odskok i:2 pres i:15, pokud je [1]=1, END pres i:16
'seti 1 6 4', // i:15 | odskok na i:2
'mulr 4 4 4', // i:16 | odskok na 16x16+1 = 257 -> END
'addi 2 2 2', // i:17 | [2] = 2
'mulr 2 2 2', //        [2] = 4
'mulr 4 2 2', // i:19   [2] = 19*4 = 76
'muli 2 11 2',// i:20   [2] = 76*11 = 836
'addi 1 2 1', // i:21   [1] = [1]+2 = 2 ?
'mulr 1 4 1', // i:22   [1] = 2*22 = 44
'addi 1 7 1', // i:23   [1] = 44+7 = 51
'addr 2 1 2', // i:24 | [2] = 836+51 = 887; // hodnota cile iteratoru pro fazi 1
'addr 4 0 4', // i:25 | zde se uplatni pocatecni [0]=1, odskok na i:27
'seti 0 8 4', //        skok na i:1 | v pripade pocatecniho [0]=0 konec smycky pocitajici cil iteratoru
'setr 4 3 1', // i:27 | [1] = 27
'mulr 1 4 1', // i:28 | [1] = 27*28=756
'addr 4 1 1', // i:29 | [1] = [1]+29 = 756+29 = 785
'mulr 4 1 1', // i:30 | [1] = 785*30 = 23550
'muli 1 14 1',// i:31 | [1] = 23550*14 = 329700
'mulr 1 4 1', // i:32 | [1] = 329700*32 = 10550400
'addr 2 1 2', // i:33 | [2] = 10550400+887 = 10551287 // finalni hodnota cile iteratoru pro fazi 2
'seti 0 3 0', // i:34 | nastavi [0] na 0, dealt with vstup [0] = 1
'seti 0 6 4'] // skok na i:1

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

function printRegs() {
    /*var root = $('#root');
    root.empty();
    regs.map(r => {
        root.append(r, '<br>');
    })*/
    console.log('regs', regs);
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

function tick(verbose) {
    var line = program[ip];
    regs = runInstruction(line.code, line.params, regs);
    regs[ipRegister]++;
    ip = regs[ipRegister];
    ticks++;
    if (verbose === true) console.log('tick', ticks, 'last ins', line.code, line.params, 'regs', regs);
}

function runWithManualIP() {
    ip = regs[ipRegister];
    while(program[ip]) {
        var line = program[ip];
        tick();
        //if (ticks > 6290000) console.log('tick', ticks, 'last ins', line.code, line.params, 'regs', regs); // p1 debug
        var ptick = ticks % 1000000000;
        if (ptick < 200) console.log('tick', ticks, 'last ins', line.code, line.params, 'regs', regs);
        if (ptick > 999999800) console.log('tick', ticks, 'last ins', line.code, line.params, 'regs', regs);
        if (ptick == 999999999) {
            console.log('breaking after 1G ticks', regs);
            timerHandle = setTimeout(() => {runWithManualIP();}, 5000);
            break;
        }
    }
}

function run() {
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

var target = 887;
var target = 10551287;
/*var thalf = Math.ceil(target/2);
var res = 1;
for (var i1 = 1; i1 <= target; i1++) {
    if (i1 % 100000 == 99999) console.log(i1, 'passed');
    for (var i2 = 1; i2 <= thalf; i2++) {
        if (i1*i2 == target) {
            res = res + i1;
            console.log(res);
        }
    }
}
*/

function printDivisors(n)  { 
    for (var i = 1; i <= n; i++)  {
        if (n % i == 0) console.log(i);
    }
} 

printDivisors(target)

//console.log(directives, program);

//console.log('regs after program finished', regs);
// p1-based guesses:
// 10551288 = guess of regs[2]+1 => too low
// 10551289 not right
// 10551997 (710+10551287) not right
// 
// regs after program finished (6) [888, 1, 887, 888, 257, 888]
// p1 magic happened like this:
// tick 6290616 last ins {code: "addr", params: Array(3)} regs (6) [1, 1, 887, 887, 7, 1]
// tick 6290617 last ins {code: "addr", params: Array(3)} regs (6) [888, 1, 887, 887, 8, 1]
// reg[0] se zveda +127?, +251, +331
// 1 -> 128 -> 379 -> 710 -> ?
// last regs: [710, 0, 10551287, 1055, 5, 3942973] (teoreticky nastavim regs a pustim to proste?)
// 1+127+251+331+31877+42037+83081+10551287