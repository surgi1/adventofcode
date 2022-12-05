const move = (stacks, reverse = false) => {
    input.split("\n").map(l => {
        let [count, from, to] = l.match(/\d+/g).map(Number),
            load = stacks[from].splice(stacks[from].length-count, count);

        if (reverse) load = load.reverse();
        stacks[to].push(...load);
    })
    return stacks.map(s => s.pop()).join('');
}

const parseStacks = () => {
    let rawStacks = rawStacksInput.split("\n").map(l => l.split('')),
        stacks = Array.from(Array(10), () => []);

    rawStacks.reverse().map(l => l.map((ch, col) => {
        if (ch.match(/[A-Z]/i)) stacks[(col+3 >> 2)].push(ch);
    }))
    return stacks;
}

console.log('part 1', move(parseStacks(), true));
console.log('part 2', move(parseStacks()));