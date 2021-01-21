const constructChain = input => {
    let chain = [];
    while (chain.length < input.length) {
        let last = chain.length > 0 ? chain[chain.length-1] : -1;
        chain.push(Math.min(...input.filter(n => n > last)))
    }
    return chain;
}

const part1 = chain => {
    let diff = [0,0,0,0];
    for (let i = 1; i < chain.length; i++) diff[chain[i]-chain[i-1]]++;
    return diff[1]*diff[3];
}

// p2
// let's apply some basic combinatorics
// 3+ consecutive number chains with distance 1 are important, say theres a chain of length n
// how many singles can be tossed out = n-2
// how many arbitrary pairs can be tossed out = komb(n,2) = n!/((n-2)!*(2!)
// this builds a multiplier

const fact = num => {
    let rval=1;
    for (let i = 2; i <= num; i++) rval = rval * i;
    return rval;
}

const combNr = (top, bottom) => fact(top)/(fact(top-bottom)*fact(bottom));

const sublenComb = num => {
    let res = num-2;
    if (res > 1) res += combNr((num-2),2);
    return res;
}

const part2 = chain => {
    let mult = 1, ptr = 1;
    while (ptr < chain.length) {
        let subLen = 1;
        while ((chain[ptr]-chain[ptr-1]) == 1) {subLen++;ptr++;}
        if (subLen >= 3) mult *= 1+sublenComb(subLen);
        ptr++;
    }
    return mult;
}

let chain = constructChain(input);
console.log('part 1', part1(chain));
console.log('part 2', part2(chain));