var rules = [];

function readRulesInput() {
    rulesInput.map(r => {
        var arr = r.split(': ');
        var nums = arr[1].match(/\d+/g);
        rules.push({
            name: arr[0],
            possibleIndexes: [],
            ranges:[
                {from: parseInt(nums[0]), to: parseInt(nums[1])},
                {from: parseInt(nums[2]), to: parseInt(nums[3])},
            ]
        });
    })
}

function checkRange(num, range) {
    return (num >= range.from) && (num <= range.to);
}

function hasValidRange(num, ranges) {
    var result = false;
    ranges.some(r => {
        if (checkRange(num, r)) {
            result = true;
            return true;
        }
    })
    return result;
}

readRulesInput();

var allRanges = [];
rules.map(r => allRanges.push(...r.ranges));

var validTickets = [];
validTickets.push(myTicket);

var sumOfInvalidNumbers = 0;
nearbyTickets.map(ticket => {
    var valid = true;
    ticket.map(num => {
        if (!hasValidRange(num, allRanges)) {
            sumOfInvalidNumbers += num;
            valid = false;
        }
    })
    if (valid) validTickets.push(ticket);
})
//console.log('sum of invalid numbers', sumOfInvalidNumbers); // p1

console.log(validTickets);

var identifiedIndexes = [];

while(identifiedIndexes.length < validTickets[0].length) {
    rules.map(r => {
        r.possibleIndexes = [];
        for (var i = 0; i < validTickets[0].length; i++) {
            if (identifiedIndexes.includes(i)) continue;
            var indexIsPossible = true;
            validTickets.some(ticket => {
                if (!hasValidRange(ticket[i], r.ranges)) {
                    indexIsPossible = false;
                    return true;
                }
            })
            if (indexIsPossible) r.possibleIndexes.push(i);
        }
    })

    rules.map(r => {
        if (r.possibleIndexes.length == 1) {
            r.index = r.possibleIndexes[0];
            identifiedIndexes.push(r.index);
        }
    })
}

console.log(rules);

var p2Answer = 1;
for (var i = 0; i <= 5; i++) {
    p2Answer *= myTicket[rules[i].index];
}

console.log('p2 answer', p2Answer);