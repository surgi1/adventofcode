let versionsAdded = 0;

const toBin = (hex, res = '') => hex.split('').map(h => parseInt(h, 16).toString(2).padStart(4, '0')).join('')

const operation = (id, params, res = 0) => {
    switch (id) {
        case 0: res = params.reduce((a, n) => a+n.val, 0); break;
        case 1: res = params.reduce((a, n) => a*n.val, 1); break;
        case 2: res = Math.min(...params.map(p => p.val)); break;
        case 3: res = Math.max(...params.map(p => p.val)); break;
        case 5: res = params[0].val > params[1].val ? 1 : 0; break;
        case 6: res = params[0].val < params[1].val ? 1 : 0; break;
        case 7: res = params[0].val == params[1].val ? 1 : 0; break;
    }
    return res;
}

const decodePacket = packet => {
    let version = parseInt(packet.substr(0,3), 2),
        typeId = parseInt(packet.substr(3,3), 2), pos, posInc;

    versionsAdded += version;

    if (typeId == 4) {
        pos = 6, s = '';
        while (packet[pos] == '1') {
            s += packet.substr(pos+1, 4);
            pos += 5;
        }
        s += packet.substr(pos+1, 4);
        return {val: parseInt(s, 2), len: pos+1+4};
    }

    let mode = parseInt(packet.substr(6,1), 2), len, subPackets = [], reachedLen = 0;

    if (mode == 0) {
        len = parseInt(packet.substr(7,15), 2);
        while (reachedLen < len) {
            let res = decodePacket(packet.substr(22+reachedLen));
            reachedLen += res.len;
            subPackets.push(res);
        }
        return {val: operation(typeId, subPackets), len: 22+reachedLen}
    } else {
        len = parseInt(packet.substr(7,11), 2);
        while (subPackets.length < len) {
            let res = decodePacket(packet.substr(18+reachedLen));
            reachedLen += res.len;
            subPackets.push(res);
        }
        return {val: operation(typeId, subPackets), len: 18+reachedLen}
    }
}

console.log('part 2', decodePacket(toBin(input)).val);
console.log('part 1', versionsAdded);