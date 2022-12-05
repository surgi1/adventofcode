const move = (stacks, reverse = false) => {
    input.split("\n").map(l => {
        let [count, from, to] = l.match(/\d+/g).map(Number);
        let load = stacks[from].splice(stacks[from].length-count, count);
        if (reverse) load = load.reverse();
        stacks[to].push(...load);
    })
    return stacks.map(s => s.pop()).join('');
}

console.log('part 1', move(stacksInput.map(e => [...e]), true));
console.log('part 2', move(stacksInput.map(e => [...e])));