const part1 = () => {
    // fcuk regexp
    const hasABBA = s => {
        for (let i = 0; i < s.length - 3; i++) {
            if (s[i] === s[i+3] && s[i+1] === s[i+2] && s[i] !== s[i+1]) return true;
        }
        return false;
    }

    return input.split("\n").filter(line => {
        let parts = line.split(/\[|\]/g);
        return parts.filter((p, i) => i % 2 == 0).some(p => hasABBA(p)) && parts.filter((p, i) => i % 2 == 1).every(p => !hasABBA(p))
    }).length
}

const part2 = () => {
    // fcuk regexp
    const getABAs = s => {
        let res = [];
        for (let i = 0; i < s.length - 2; i++) {
            if (s[i] === s[i+2] && s[i] !== s[i+1]) res.push(s[i]+s[i+1]+s[i+2]);
        }
        return res;
    }

    const hasBAB = (s, aba) => s.includes(aba[1] + aba[0] + aba[1]);

    return input.split("\n").filter(line => {
        let parts = line.split(/\[|\]/g);
        let evenParts = parts.filter((p, i) => i % 2 == 0);
        let abas = parts.filter((p, i) => i % 2 == 1).map(getABAs).flat();

        return abas.some(aba => evenParts.some(p => hasBAB(p, aba)));
    }).length
}

console.log('p1', part1());
console.log('p2', part2());