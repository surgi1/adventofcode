var variants = [], start = 'e', replacements = [], steps = 0;

function readInput() {
    inputReplacements.map(r => {
        var parsed = r.split(' => ');
        replacements.push({from: parsed[0], to: parsed[1]});
    })
}

function generateVariants(s, r) {
    var i = 0;
    while(s.indexOf(r.from, i) > -1) {
        var vs = s.substr(0,s.indexOf(r.from, i), r.from.length) + r.to + s.substr(s.indexOf(r.from, i)+r.from.length)
        if (!variants.includes(vs)) variants.push(vs);
        i++;
    }
}

function generateAllVariants(sArr) {
    variants = [];
    sArr.map(s => {
        if (s.length <= input.length) replacements.map(r => generateVariants(s, r))
    })    
}

function repeatedlyApplyReversed(s, r) {
    while(s.indexOf(r.to) > -1) {
        var vs = s.substr(0,s.indexOf(r.to), r.to.length) + r.from + s.substr(s.indexOf(r.to)+r.to.length);
        s = vs;
        steps++;
    }
    return s;
}

readInput();

// p1
//generateAllVariants([input]);
//console.log(variants, variants.length);

// p2 - reduce way
// this could be improved by reseting to longest replacements after each successful replacement
// somehow this wasn't required for puzzle completion..

replacements.sort((a,b) => {
    return b.to.length - a.to.length;
})

var s = input;
while(s != 'e') {
    replacements.map(r => {
        s = repeatedlyApplyReversed(s, r);
    })
}

console.log(s, steps);