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

// attempt mk 2
const combine = (s) => {
    let match = s.match(/\d+/g);
    while (match && match.length > 0) {
        s = s.replace(match[0], '(' + rules[match[0]].originalValue + ')');
        match = s.match(/\d+/g);
    } 
    return s.replaceAll(' ', '');
}

let regexpStr = '^'+combine(rules[0].originalValue)+'$';
let re = new RegExp(regexpStr);

console.log(regexpStr);

let count = 0;
input.map(word => {
    if (word.match(regexpStr)) count++;
})

console.log(count);
