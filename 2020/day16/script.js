let rules = [];

const readRulesInput = () => {
    rulesInput.map(r => {
        let arr = r.split(': ');
        let nums = arr[1].match(/\d+/g);
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

const checkRange = (num, range) => {
    return (num >= range.from) && (num <= range.to);
}

const hasValidRange = (num, ranges) => {
    let result = false;
    ranges.some(r => {
        if (checkRange(num, r)) {
            result = true;
            return true;
        }
    })
    return result;
}

readRulesInput();

let allRanges = [];
rules.map(r => allRanges.push(...r.ranges));

let validTickets = [];
validTickets.push(myTicket);

let sumOfInvalidNumbers = 0;
nearbyTickets.map(ticket => {
    let valid = true;
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

let identifiedIndexes = [];

while(identifiedIndexes.length < validTickets[0].length) {
    rules.map(r => {
        r.possibleIndexes = [];
        for (let i = 0; i < validTickets[0].length; i++) {
            if (identifiedIndexes.includes(i)) continue;
            let indexIsPossible = true;
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

let p2Answer = 1;
for (let i = 0; i <= 5; i++) {
    p2Answer *= myTicket[rules[i].index];
}

console.log('p2 answer', p2Answer);