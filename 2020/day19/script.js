const parseRules = (rules = []) => {
    inputRules.map(rule => {
        let arr = rule.split(': ');
        rules[arr[0]] = arr[1].replace(/"/g, '');
    })
    return rules;
}

const combine = s => {
    let match = s.match(/\d+/g);
    while (match && match.length > 0) {
        s = s.replace(match[0], '(' + rules[match[0]] + ')');
        match = s.match(/\d+/g);
    } 
    return s.replaceAll(' ', '');
}

const run = () => {
    let regexpStr = '^'+combine(rules[0])+'$';
    return input.filter(w => w.match(regexpStr)).length;
}

let rules = parseRules();
console.log('part 1', run());

rules[8] = '42+';
rules[11] = '42 31|42 ( 42 31|42 ( 42 31|42 ( 42 31|42 ( 42 31 ) 31 ) 31 ) 31 ) 31';
// ^ recursion applied 1 level more than was sufficient for my input; this can be automated if necessary
console.log('part 2', run());