let arr = [], size = 16, actions = input.split(',');

const init = () => {
    for (let i = 0; i < size; i++) arr[i] = String.fromCharCode('a'.charCodeAt(0)+i);
}

const move = line => {
    let action = line[0];
    let params = line.substring(1).split('/');
    switch (action) {
        case 's': 
            let tail = arr.splice(arr.length-parseInt(params[0]));
            arr = [].concat(tail, arr);
            break;
        case 'x':
            [arr[params[1]], arr[params[0]]] = [arr[params[0]], arr[params[1]]];
            break;
        case 'p':
            let i0 = arr.indexOf(params[0]), i1 = arr.indexOf(params[1]);
            [arr[i1], arr[i0]] = [arr[i0], arr[i1]];
            break;
    }
}

const part1 = () => {
    init();
    actions.map(move);
    console.log('part 1', arr.join(''));
}

const part2 = () => {
    init();
    let states = [arr.join('')], loopSize = 0;
    while (true) {
        actions.map(move);
        loopSize++;
        let state = arr.join('');
        if (states.includes(state)) break;
        states.push(state);
    }
    for (let i = 0; i < (1000000000 % loopSize); i++) actions.map(move);
    console.log('part 2', arr.join(''));
}

part1();
part2();