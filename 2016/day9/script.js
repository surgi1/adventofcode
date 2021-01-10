const directiveParams = s => s.match(/\d+/g).map(d => d = parseInt(d));

const part2 = () => {
    let counts = [], len = input.length;
    for (let i = 0; i < len; i++) counts[i] = 1;

    const getActiveDirective = () => {
        let index = 0, found = -1;
        while (index < input.length) {
            index = input.indexOf('(', index);
            if (index == -1) break;
            if (counts[index] != 0) {
                found = index;
                break;
            } else {
                index = index+1;
            }
        }
        return found;
    }

    while (getActiveDirective() > -1) {
        let directiveStart = getActiveDirective(), directiveEnd = input.indexOf(')', directiveStart), directive = input.substring(directiveStart, directiveEnd);
        let params = directiveParams(directive);
        for (let i = 0; i < params[0]; i++) counts[directiveEnd+1+i] *= params[1];
        for (let i = directiveStart; i <= directiveEnd; i++) counts[i]  = 0;
    }

    console.log('part 2', counts.reduce((a, b) => a+b, 0));
}

const part1 = () => {
    let index = 0, length = 0;

    while (input.indexOf('(', index) > -1) {
        let directiveStart = input.indexOf('(', index), directiveEnd = input.indexOf(')', directiveStart), directive = input.substring(directiveStart, directiveEnd);
        let params = directiveParams(directive);
        length += directiveStart-index+params[0]*params[1];
        index = directiveEnd+1+params[0];
    }
    console.log('part 1', length);
}

part1();
part2();