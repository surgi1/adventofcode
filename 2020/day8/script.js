const run = dat => {
    let ptr = 0;
    let acc = 0;

    const tick = () => {
        if (!dat[ptr]) return 'EOF';
        if (dat[ptr].executed) return 'INF';

        dat[ptr].executed = true;
        
        switch (dat[ptr].i) {
            case 'nop': 
                ptr++;
                break;
            case 'acc':
                acc = acc+dat[ptr].v;
                ptr++;
                break;
            case 'jmp':
                ptr = ptr+dat[ptr].v;
                break;
        }
        return true;
    }

    let cnt = true, tickCode;
    while (cnt) {
        tickCode = tick();
        if (tickCode !== true) cnt = false;
    }
    //console.log(tickCode, 'acc value', acc, 'ptr value', ptr, dat);

    return {code: tickCode, acc: acc, ptr: ptr};
}

let switchPtr = 0;
let cnt = true;

// p2
while (cnt) {
    while(!['jmp', 'nop'].includes(data[switchPtr].i)) {switchPtr++};
    let dataCp = $.extend(true, {}, data);
    if (dataCp[switchPtr].i == 'nop') dataCp[switchPtr].i = 'jmp'; else dataCp[switchPtr].i = 'nop';

    let res = run(dataCp);
    console.log('changed instruction on line', switchPtr, 'resulted in', res);
    if (res.code == 'EOF') cnt = false;
    
    switchPtr++;
    if (switchPtr >= data.length) cnt = false;
}

//run(data);