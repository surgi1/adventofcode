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

// p2
// let's apply some basic combinatorics
// 3+ consecutive number chains with distance 1 are important, say there chain of length n
// how many singles can be tossed out = n-2
// how many arbitrary pairs can be tossed out = komb(n,2) = n!/((n-2)!*(2!)
// this builds a multiplier

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