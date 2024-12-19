const init = input => {
    let [patternsLit, towelsLit] = input.split("\n\n");
    return [
        patternsLit.split(', ').map(v => v.split('')),
        towelsLit.split('\n').map(l => l.split(''))
    ]
}

const combs = (towel, patterns) => {
    let memo = {};

    const recur = (pos) => {
        if (memo[pos] !== undefined) return memo[pos];
        if (pos == towel.length) return 1;

        let matches = patterns.filter(p => p.every((pv, i) => towel[pos+i] == pv));
        let res = 0;
        matches.forEach(p => res += recur(pos+p.length));
        memo[pos] = res;
        return res;
    }

    return recur(0);
}

const run1 = (patterns, towels) => towels.filter(towel => combs(towel, patterns) > 0).length;
const run = (patterns, towels) => towels.reduce((a, towel) => a + combs(towel, patterns), 0);

console.log('p1', run1(...init(input)))
console.log('p2', run(...init(input)))
