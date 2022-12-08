const move = (stacks, reverse = false) => {
    input.split("\n").map(l => {
        let [count, from, to] = l.match(/\d+/g).map(Number),
            load = stacks[from].splice(stacks[from].length-count, count);
        stacks[to].push(...(reverse ? load.reverse() : load));
    })
    return stacks.map(s => s.pop()).join('');
}

const parseStacks = () => {
    let tmp = rawStacksInput.split("\n").map(l => l.split('')),
        stacks = Array.from(Array(10), () => []);

    tmp.reverse().map(l => l.map((c, col) => c.match(/[A-Z]/) && stacks[(col+3)/4].push(c)))
    return stacks;
}

console.log(move(parseStacks(), true));
console.log(move(parseStacks()));
