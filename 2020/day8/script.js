const run = dat => {
    let ptr = 0, acc = 0, tickCode = true;
    const tick = () => {
        if (!dat[ptr]) return 'EOF';
        if (dat[ptr].executed) return 'INF';
        dat[ptr].executed = true;
        switch (dat[ptr].i) {
            case 'nop': ptr++; break;
            case 'acc': acc = acc+dat[ptr].v; ptr++; break;
            case 'jmp': ptr = ptr+dat[ptr].v; break;
        }
        return true;
    }
    while (tickCode === true) tickCode = tick();
    return {code: tickCode, acc: acc, ptr: ptr};
}

const extend = a => a.map(e => Object({...e}));
const part1 = () => console.log('part 1', run(extend(data)).acc);
const part2 = () => {
    let switchPtr = 0, res;
    while (true) {
        while (!['jmp', 'nop'].includes(data[switchPtr].i)) switchPtr++;
        let dataCp = extend(data);
        data.map(d => d.executed = false)
        dataCp[switchPtr].i = dataCp[switchPtr].i == 'nop' ? 'jmp' : 'nop';
        res = run(dataCp);
        switchPtr++;
        if (res.code == 'EOF' || switchPtr >= data.length) break;
    }
    if (res.code == 'EOF') console.log('part 2', res.acc);
}

part1();
part2();