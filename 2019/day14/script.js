let reactions = [], leftovers = {}, oreNeeded;

const readInput = () => {
    const splitElement = s => {
        let arr = s.split(' ');
        return {
            amount: parseInt(arr[0]),
            name: arr[1]
        }
    }
    input.map(line => {
        let tmp = {source: []};
        let arr = line.split(' => ')
        let leftArr = arr[0].split(', ');
        leftArr.map(s => tmp.source.push(splitElement(s)));
        tmp.product = splitElement(arr[1]);
        reactions.push(tmp);
    })
}

const getReactionFor = name => {
    let reaction = false;
    reactions.some(r => {
        if (r.product.name == name) reaction = r;
    });
    return reaction;
}

const create = (name, amount) => {
    // deduct whats in leftovers first
    if (leftovers[name]) {
        if (leftovers[name] >= amount) {
            leftovers[name] -= amount;
            return;
        } else {
            amount -= leftovers[name];
            delete leftovers[name];
        }
    }

    let reaction = getReactionFor(name);
    let times = Math.ceil(amount/reaction.product.amount);
    let sources = [];
    reaction.source.map(source => {
        sources.push({
            name: source.name,
            amount: times*source.amount
        })
    })
    // add whats going to be left over
    let leftoverAmount = times*reaction.product.amount - amount;
    if (leftoverAmount > 0) {
        if (!leftovers[reaction.product.name]) leftovers[reaction.product.name] = 0;
        leftovers[reaction.product.name] += leftoverAmount;
    }

    // deduct available leftovers
    sources.map(source => {
        if (leftovers[source.name]) {
            if (leftovers[source.name] >= source.amount) {
                leftovers[source.name] -= source.amount;
                source.amount = 0;
            } else {
                source.amount -= leftovers[source.name];
                delete leftovers[source.name];
            }
        }
    })
    // create whats needed
    sources.map(source => {
        if (source.amount > 0) {
            if (source.name == 'ORE') {
                oreNeeded += source.amount;
            } else {
                create(source.name, source.amount);
            }
        }
    })
}

const createFuel = amount => {
    leftovers = {};
    oreNeeded = 0;
    create('FUEL', amount);
    return oreNeeded;
}

readInput();

let headstart = 1180000; // part2 ballpark estimate
while (createFuel(headstart) < 1000000000000) headstart++;

console.log('Created', headstart, 'fuel (better check exact number using createFuel(amount) due to some weird JS shenanigans); ore needed', oreNeeded, 'leftovers', leftovers);
