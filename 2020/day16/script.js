let rules = [], allRanges = [], validTickets = [], sumOfInvalidNumbers = 0,
    identifiedIndexes = [], p2Answer = 1;

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

const hasValidRange = (num, ranges) => {
    let result = false;
    ranges.some(range => {
        if ((num >= range.from) && (num <= range.to)) {
            result = true;
            return true;
        }
    })
    return result;
}

readRulesInput();
rules.map(r => allRanges.push(...r.ranges));
validTickets.push(myTicket);

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
console.log('part 1', sumOfInvalidNumbers);

while (identifiedIndexes.length < validTickets[0].length) {
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

for (let i = 0; i <= 5; i++) p2Answer *= myTicket[rules[i].index];
console.log('part 2', p2Answer);