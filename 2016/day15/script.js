const timeValid = t => {
    let valid = true;
    input.some((disc, i) => {
        if ((t+i+1+disc.start) % disc.mod != 0) {
            valid = false;
            return true;
        }
    })
    return valid;
}

const sync = () => {
    let t = 0;
    while (!timeValid(t)) t++;
    return t;
}

console.log('time in sync part 1', sync());

input.push({mod: 11, start: 0})
console.log('time in sync part 2', sync());