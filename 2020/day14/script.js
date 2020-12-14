var mask = '';
/*
// p1
var maskAND, maskOR, mem = [];

input.map(line => {
    if (line[0] == 'mask') {
        var s1 = '0b' + line[1].replace(/X/g, '1');
        var s0 = '0b' + line[1].replace(/X/g, '0');
        maskAND = BigInt( s1 );
        maskOR = BigInt( s0 );
    } else {
        mem[ BigInt(line[1]) ]  = BigInt(line[2]) & maskAND | maskOR;
    }
})
*/

// p2
String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}

var addresses = [];
function generateMemAddresses(m) {
    var i = m.indexOf('X');
    if (i == -1) {
        addresses.push(m);
        return;
    }
    generateMemAddresses(m.replace('X', '1'));
    generateMemAddresses(m.replace('X', '0'));

};

function applyMask(s) {
    var res = '';
    for (var i = 0; i < s.length; i++) {
        if (mask[i] == '0') res = res + s[i];
        else if (mask[i] == '1') res = res + '1';
        else if (mask[i] == 'X') res = res + 'X';
    }
    return res;
}

function num2BinStr(n) {
    var pow = 0;
    var s = '';
    while (Math.ceil(n/2) > 0) {
        s = (n % 2) + s;
        n = Math.floor(n/2);
    }
    while (s.length < 36) s = '0'+s;
    return s;    
}

var mem = {};

function fillMem(baseAddress, value) {
    // fill all mem addresses by permuting X in mask by value
    // first mask baseAddress
    // then permutate

    addresses = [];
    var m = applyMask(num2BinStr(baseAddress));
    generateMemAddresses(m);

    console.log(baseAddress, addresses.length);
    addresses.map(a => {
        mem['0b'+a] = value;
    })
}

input.map(line => {
    if (line[0] == 'mask') {
        mask = line[1];
    } else {
        fillMem(parseInt(line[1]), parseInt(line[2]));
    }
})

console.log('mem length', Object.values(mem).length);

console.time('sum time');
var sum = Object.values(mem).reduce((pv, cv) => pv + cv, 0);
console.log('mem sum', sum);

console.timeEnd('sum time');
// p1: 9296748256641
// p2: 4877695371685 correct
