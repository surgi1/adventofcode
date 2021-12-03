const part1 = () => {
    let x = 0, z = 0;
    input.map(line => {
        let tmp = line.split(' ');
        let val = parseInt(tmp[1]);
        switch (tmp[0]) {
            case 'up': z  -= val; break;
            case 'down': z  += val; break;
            case 'forward': x  += val; break;
        }
    })
    return x*z;
}

const part2 = () => {
    let x = 0, z = 0, aim = 0;
    input.map(line => {
        let tmp = line.split(' ');
        let val = parseInt(tmp[1]);
        switch (tmp[0]) {
            case 'up': aim  -= val; break;
            case 'down': aim  += val; break;
            case 'forward': x  += val; z += aim*val; break;
        }
    })
    return x*z;
}

console.log(part1());
console.log(part2());