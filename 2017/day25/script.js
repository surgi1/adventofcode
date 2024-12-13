const readBlueprints = input => {
    const letter2Id = letter => letter.charCodeAt(0) - 'A'.charCodeAt(0);
    const id2letter = id => String.fromCharCode('A'.charCodeAt(0)+id);
    const findLine = (input, text) => {
        let res = input.filter(line => line.indexOf(text) > -1);
        return res && res[0];
    };

    const readState = (input, letter) => {
        let descStart = input.indexOf('In state '+letter+':'), state = [];
        for (let i = 0; i < 2; i++) state.push({
            write: parseInt(input[descStart+4*i+2].match(/\d+/g)[0]),
            move: input[descStart+4*i+3].indexOf('right') > -1 ? 'right' : 'left',
            next: letter2Id(input[descStart+4*i+4].split(' ').pop())
        })
        return state;
    }

    let bp = {states: []};
    bp.start = letter2Id(findLine(input, 'Begin in state').split(' ').pop());
    bp.checksumAfter = parseInt(findLine(input, 'Perform a diagnostic checksum after').match(/\d+/g)[0]);
    while (findLine(input, 'In state '+id2letter(bp.states.length)+':')) bp.states.push(readState(input, id2letter(bp.states.length)));
    return bp;
}

let machine = new TuringMachine(readBlueprints(input.split("\n")));

console.log('checksum', machine.run());
