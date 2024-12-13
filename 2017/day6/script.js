let states = [], steps = 0;

const redistribute = arr => {
    let max = Math.max(...input), len = arr.length, offset = input.indexOf(max);
    arr[offset] = 0;
    for (let i = 1; i <= max; i++) arr[(offset+i) % len]++;
    return arr;
}

while (true) {
    let state = input.join('');
    if (states.includes(state)) {
        console.log('Same state reached after', steps, 'steps. Loop length is', steps-states.indexOf(state));
        break;
    }
    states.push(state);
    input = redistribute(input);
    steps++;
}
