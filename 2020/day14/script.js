const part1 = () => {
    let maskAND, maskOR, mem = [];
    input.map(line => {
        if (line[0] == 'mask') {
            let s1 = '0b' + line[1].replace(/X/g, '1');
            let s0 = '0b' + line[1].replace(/X/g, '0');
            maskAND = BigInt(s1);
            maskOR = BigInt(s0);
        } else {
            mem[BigInt(line[1])] = BigInt(line[2]) & maskAND | maskOR;
        }
    })
    console.log('part 1', Object.values(mem).reduce((pv, cv) => pv + cv, 0n));
}

const part2 = () => {
    let mask = '', mem = {}, addresses = [];

    const generateMemAddresses = m => {
        let i = m.indexOf('X');
        if (i == -1) {
            addresses.push(m);
            return;
        }
        generateMemAddresses(m.replace('X', '1'));
        generateMemAddresses(m.replace('X', '0'));

    };

    const applyMask = s => {
        let res = '';
        for (let i = 0; i < s.length; i++) {
            if (mask[i] == '0') res = res + s[i];
            else if (mask[i] == '1') res = res + '1';
            else if (mask[i] == 'X') res = res + 'X';
        }
        return res;
    }

    const num2BinStr = n => {
        let s = n.toString(2);
        while (s.length < 36) s = '0'+s;
        return s;    
    }

    const fillMem = (baseAddress, value) => {
        // fill all mem addresses by permuting X in mask by value
        // first mask baseAddress, then permutate
        addresses = [];
        generateMemAddresses(applyMask(num2BinStr(baseAddress)));
        addresses.map(a => mem['0b'+a] = value)
    }

    input.map(line => {
        if (line[0] == 'mask') {
            mask = line[1];
        } else {
            fillMem(parseInt(line[1]), parseInt(line[2]));
        }
    })

    console.log('part 2', Object.values(mem).reduce((pv, cv) => pv + cv, 0));
}

part1();
part2();
