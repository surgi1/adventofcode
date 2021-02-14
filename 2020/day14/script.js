const part1 = () => {
    let maskAND, maskOR, mem = [];
    input.map(line => {
        if (line[0] == 'mask') {
            maskAND = BigInt('0b' + line[1].replace(/X/g, '1'));
            maskOR = BigInt('0b' + line[1].replace(/X/g, '0'));
        } else
            mem[BigInt(line[1])] = BigInt(line[2]) & maskAND | maskOR;
    })
    console.log('part 1', Object.values(mem).reduce((pv, cv) => pv + cv, 0n));
}

const part2 = () => {
    let mask = '', mem = {}, addresses = [];

    const applyMask = s => s.split('').reduce((res, v, i) => res += (mask[i] == '0' ? v : mask[i]) , '')
    const generateMemAddresses = m => {
        if (m.indexOf('X') == -1) return addresses.push(m);
        generateMemAddresses(m.replace('X', '1'));
        generateMemAddresses(m.replace('X', '0'));
    };

    const fillMem = (baseAddress, value) => {
        // fill all mem addresses by permuting X in mask by value
        // first mask baseAddress, then permutate
        addresses = [];
        generateMemAddresses(applyMask(baseAddress.toString(2).padStart(36, '0')));
        addresses.map(a => mem['0b'+a] = value)
    }

    input.map(line => {
        if (line[0] == 'mask') mask = line[1]; else fillMem(parseInt(line[1]), parseInt(line[2]));
    })

    console.log('part 2', Object.values(mem).reduce((pv, cv) => pv + cv, 0));
}

part1();
part2();
