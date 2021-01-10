const init = 'abcdefgh', initPart2 = 'fbgdceah';

Array.prototype.rotate = function(direction = 'right', times = 1) {
    for (let i = 0; i < times; i++) {
        if (direction == 'left') this.push(this.shift()); 
        if (direction == 'right') this.unshift(this.pop()); 
    }
    return this; 
} 

const process = (line, arr) => {
    let output = arr.slice();
    let params = line.split(' ');
    if (params[0] == 'swap' && params[1] == 'position') {
        [output[params[2]], output[params[5]]] = [output[params[5]], output[params[2]]];
    } else if (params[0] == 'swap' && params[1] == 'letter') {
        let i1 = output.indexOf(params[2]), i2 = output.indexOf(params[5]);
        [output[i1], output[i2]] = [output[i2], output[i1]];
    } else if (params[0] == 'reverse') {
        output = [].concat(output.slice(0, params[2]), output.slice(params[2], parseInt(params[4])+1).reverse(), output.slice(parseInt(params[4])+1));
    } else if (params[0] == 'rotate' && ['left', 'right'].includes(params[1])) {
        output = output.rotate(params[1], parseInt(params[2]));
    } else if (params[0] == 'rotate' && params[1] == 'based') {
        let count = output.indexOf(params[6]);
        output = output.rotate('right', (count >= 4 ? 1 : 0) + 1 + count);
    } else if (params[0] == 'move') {
        output.splice(params[5], 0, output.splice(params[2], 1)[0]);
    } else {
        console.log('unsupported op', line);
    }
    return output;
}

const processReverse = (line, arr) => {
    let output = arr.slice();
    let params = line.split(' ');
    if (['swap', 'reverse'].includes(params[0])) {
        output = process(line, arr);
    } else if (params[0] == 'rotate' && ['left', 'right'].includes(params[1])) {
        output = output.rotate(params[1] == 'left' ? 'right' : 'left', parseInt(params[2]));
    } else if (params[0] == 'rotate' && params[1] == 'based') {
        // bruteforce
        output = arr.slice();
        let found = false;
        while (!found) {
            output = output.rotate('left');
            found = process(line, output).join('') == arr.join('');
        }
    } else if (params[0] == 'move') {
        output.splice(params[2], 0, output.splice(params[5], 1)[0]);
    } else {
        console.log('unsupported op', line);
    }
    return output;
}

const part1 = () => {
    let arr = init.split('');
    input.map(line => arr = process(line, arr));
    console.log('part 1', arr.join(''));
}

const part2 = () => {
    let arr = initPart2.split('');
    input.reverse().map(line => arr = processReverse(line, arr));
    console.log('part 2', arr.join(''));
}

part1();
part2();
