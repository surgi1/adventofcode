// ended up with constructing the regexp approach
var rules = [];

function parseRules() {
    inputRules.map(rule => {
        var tmp = {};
        var arr = rule.split(': ');
        tmp.originalValue = arr[1];
        if (arr[1].indexOf('"') > -1) tmp.originalValue = arr[1][1];
        rules[arr[0]] = tmp;
    })
}

parseRules();

// attempt mk 2
function combine(s) {
    var match = s.match(/\d+/g);
    while (match && match.length > 0) {
        s = s.replace(match[0], '(' + rules[match[0]].originalValue + ')');
        match = s.match(/\d+/g);
    } 
    return s.replaceAll(' ', '');
}

var regexpStr = '^'+combine(rules[0].originalValue)+'$';
var re = new RegExp(regexpStr);

console.log(regexpStr);

var count = 0;
input.map(word => {
    if (word.match(regexpStr)) count++;
})

console.log(count);
