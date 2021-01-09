// just part 2
// ended up with constructing the regexp approach
let rules = [];

const parseRules = () => {
    inputRules.map(rule => {
        let tmp = {};
        let arr = rule.split(': ');
        tmp.originalValue = arr[1];
        if (arr[1].indexOf('"') > -1) tmp.originalValue = arr[1][1];
        rules[arr[0]] = tmp;
    })
}

parseRules();

const combine = s => {
    let match = s.match(/\d+/g);
    while (match && match.length > 0) {
        s = s.replace(match[0], '(' + rules[match[0]].originalValue + ')');
        match = s.match(/\d+/g);
    } 
    return s.replaceAll(' ', '');
}

let regexpStr = '^'+combine(rules[0].originalValue)+'$';

console.log(input.filter(w => w.match(regexpStr)).length);