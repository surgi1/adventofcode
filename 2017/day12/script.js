let used = [], groups = 0, unusedId = 0;

const spread = id => {
    if (!used.includes(id)) {
        used.push(id);
        input[id].map(spread);
    }
}

while (used.length < input.length) {
    while (used.includes(unusedId)) unusedId++;
    spread(unusedId);
    if (groups == 0) console.log('part 1', used.length);
    groups++;
}
console.log('part 2', groups);