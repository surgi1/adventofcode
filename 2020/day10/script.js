const part1 = chain => {
    let diff = [0,0,0,0];
    for (let i = 1; i < chain.length; i++) diff[chain[i]-chain[i-1]]++;
    return diff[1]*diff[3];
}

// for part 2 let's apply some basic combinatorics
// 3+ consecutive number chains with distance 1 are important, say theres a chain of length n
// how many singles can be tossed out? n-2
// how many arbitrary pairs can be tossed out? komb(n,2) = n!/((n-2)!*(2!)
// this builds a multiplier

const fact = (n, r = 1) => {
    while (n > 0) r *= n--;
    return r;
}
const combNr = (top, bottom) => fact(top)/(fact(top-bottom)*fact(bottom))
const sublenComb = (num, res = num-2) => res + (res > 1 ? combNr((num-2),2) : 0)

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

input.sort((a, b) => a-b);
console.log('part 1', part1(input));
console.log('part 2', part2(input));