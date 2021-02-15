const part1 = (mask = '', mem = {}) => {
    input.map(a => a[0] == 'mask' ? mask = a[1] : mem[a[1]] = BigInt(a[2]) & BigInt('0b'+mask.replace(/X/g, 1)) | BigInt('0b'+mask.replace(/X/g, 0)))
    return Object.values(mem).reduce((a, v) => a+v, 0n);
}

const part2 = (mask = '', mem = {}, addresses = []) => {
    const applyMask = s => s.split('').reduce((res, v, i) => res += mask[i] == '0' ? v : mask[i] , '')
    const generateMemAddresses = m => {
        if (m.indexOf('X') == -1) return addresses.push(m);
        generateMemAddresses(m.replace('X', 1));
        generateMemAddresses(m.replace('X', 0));
    };

    const fillMem = (baseAddress, value) => {
        // fill all mem addresses by permutating X in mask by value; first mask baseAddress, then permutate
        addresses = [];
        generateMemAddresses(applyMask(baseAddress.toString(2).padStart(36, '0')));
        addresses.map(a => mem[a] = value)
    }

    input.map(a => a[0] == 'mask' ? mask = a[1] : fillMem(parseInt(a[1]), parseInt(a[2])))
    return Object.values(mem).reduce((a, v) => a+v, 0);
}

console.log('part 1', part1().toString());
console.log('part 2', part2().toString());
