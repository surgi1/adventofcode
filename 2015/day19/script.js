let variants = [], steps = 0, s = input;

const generateVariants = (s, r, i = 0) => {
    while (s.indexOf(r.from, i) > -1) {
        let vs = s.substr(0,s.indexOf(r.from, i), r.from.length) + r.to + s.substr(s.indexOf(r.from, i)+r.from.length)
        if (!variants.includes(vs)) variants.push(vs);
        i++;
    }
}

const repeatedlyApplyReversed = (s, r) => {
    while (s.indexOf(r.to) > -1) {
        s = s.substr(0,s.indexOf(r.to), r.to.length) + r.from + s.substr(s.indexOf(r.to)+r.to.length);
        steps++;
    }
    return s;
}

let replacements = inputReplacements.map(r => new Object({from: r.split(' => ')[0], to: r.split(' => ')[1]}))

// p1
replacements.map(r => generateVariants(input, r));
console.log('part 1', variants.length);

// p2 - reduce way
// this could be improved by reseting to longest replacements after each successful replacement
// somehow this wasn't required for puzzle completion..

replacements.sort((a,b) => b.to.length - a.to.length);
while (s != 'e') replacements.map(r => s = repeatedlyApplyReversed(s, r))

console.log('part 2', steps);