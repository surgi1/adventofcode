//var input = [16, 10, 15, 5, 1, 11, 7, 19, 6, 12, 4];
//var input = [1, 2, 3, 4, 7/*, 8, 9, 10, 11*/];
//var input = [28, 33, 18, 42, 31, 14, 46, 20, 48, 47, 24, 23, 49, 45, 19, 38, 39, 11, 1, 32, 25, 35, 8, 17, 7, 9, 4, 2, 34, 10, 3];
var input = [49, 89, 70, 56, 34, 14, 102, 148, 143, 71, 15, 107, 127, 165, 135, 26, 119, 46, 53, 69, 134, 1, 40, 81, 140, 160, 33, 117, 82, 55, 25, 11, 128, 159, 61, 105, 112, 99, 93, 151, 20, 108, 168, 2, 109, 75, 139, 170, 65, 114, 21, 92, 106, 162, 124, 158, 38, 136, 95, 161, 146, 129, 154, 121, 86, 118, 88, 50, 48, 62, 155, 28, 120, 78, 60, 147, 87, 27, 7, 54, 39, 113, 5, 74, 169, 6, 43, 8, 29, 18, 68, 32, 19, 133, 22, 94, 47, 132, 59, 83, 12, 13, 96, 35];

input.push(0);
input.push(Math.max(...input)+3);

var chain = [];

while (chain.length < input.length) {
    var last = -1;
    var min = 5000;
    if (chain.length > 0) {
        last = chain[chain.length-1];
    }
    for (var i = 0; i < input.length; i++) {
        if (input[i] > last) {
            if (input[i] < min) min = input[i];
        }
    }
    chain.push(min);
}

function countDifferences(chain) {
    var dif = [0,0,0,0];
    for (var i = 1; i < chain.length; i++) {
        dif[chain[i]-chain[i-1]]++;
    }
    return dif;
}

console.log('resulting chain', chain, countDifferences(chain))

// p2 pracuje dale s chainem
/*
var tda = [{chain:chain, start:2}], ptr = 0, found = 1;

while (ptr < tda.length) {
    var cChain = tda[ptr].chain;
    //console.log('checking cChain', ptr, cChain);
    for (var i = tda[ptr].start; i < cChain.length; i++) {
        if ((cChain[i]-cChain[i-2]) <= 3) {
            // reseni bez cChain[i-1] stale funguje
            found++;
            var nextChain = cChain.slice();
            nextChain.splice(i-1,1);
            tda.push({chain:nextChain,start:i});
        }
    }
    ptr++;
}*/

// recursive way
// taky pomaly

var found = 1;
function checkChain(chain, start) {
    for (var i = start; i < chain.length; i++) {
        if ((chain[i]-chain[i-2]) <= 3) {
            // reseni bez cChain[i-1] stale funguje
            found++;
            var nextChain = chain.slice();
            nextChain.splice(i-1,1);
            checkChain(nextChain, i);
        }
    }
}

//checkChain(chain,0);

//console.log('found solutions rekurze', found);

// zkusime kombinatoriku
// prochazime pole az najdeme sekvenci alespon 3 cisel vzdalenych o 1 (nasli jsme n cisel)
// spocitame vyskrtnuti prave jednoho vnitrniho cisla skrt1 = n-2
// spocitame vyskrtnuti prave dvou libovolnych vnitrnich cisel skrt2 = komb(n,2) = n!/((n-2)!*(2!)
// to je nas multiplikator, ktery postupuje dal
/*var mult = 1;
for (var i=0; i<chain.length-2; i++) {
    if (((chain[i+1]-chain[i]) == 1) && ((chain[i+2]-chain[i+1]) == 1)) {
        mult = mult*2;
    }
}*/

function fact(num){
    var rval=1;
    for (var i = 2; i <= num; i++)
        rval = rval * i;
    return rval;
}

function combNr(top, bottom) {
    return fact(top)/(fact(top-bottom)*fact(bottom))
}

function sublenComb(num) {
    var res = num-2;
    if (res > 1) res = res+combNr((num-2),2);
    return res;
}

//console.log('fact (3 2)', combNr(3,2) );

var mult = 1, ptr = 1;
while(ptr < chain.length) {
    var subLen = 1;
    while((chain[ptr]-chain[ptr-1]) == 1) {subLen++;ptr++;}
    if (subLen>=3) {
        console.log('found sublen', subLen);
        mult = mult*(1+sublenComb(subLen));
    }
    ptr++;
}

console.log('found solutions comb', mult);