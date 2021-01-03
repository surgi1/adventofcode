const init = '01111001100111011', size1 = 272, size2 = 35651584;

const reverseDragonString = s => {
    let res = '';
    for (let i = 0; i < s.length; i++) res = (s[i] == '0' ? '1' : '0')+res;
    return res;
}

const dragonCurve = data => {
    return data + '0' + reverseDragonString(data);
}

const checksum = (data, length) => {
    let len = Math.min(data.length, length) >> 1;
    let res = '';
    for (let i = 0; i < len; i++) {
        if (data[i*2] == data[i*2+1]) res += '1'; else res += '0';
    }
    if (res.length % 2 == 0) return checksum(res, length);
    return res;
}

const fill = (init, size) => {
    let data = init;
    while (data.length < size) data = dragonCurve(data);
    console.log('checksum for size', size, ':', checksum(data, size));
}

fill(init, size1);
fill(init, size2);