let testInput1 = 'D2FE28';
let testInput2 = '38006F45291200';
let testInput3 = 'EE00D40C823060';
let testInput10 = 'A0016C880162017C3686B18A3D4780';
let versionsAdded = 0;

const toBin = (hex, res = '') => hex.split('').map(h => parseInt(h, 16).toString(2).padStart(4, '0')).join('')

const decodePacket = packet => {
    let version = parseInt(packet.substr(0,3), 2);
    versionsAdded += version;
    let typeId = parseInt(packet.substr(3,3), 2);
    console.log(version, typeId, packet);
    let pos, posInc;
    if (typeId == 4) {
        pos = 6, s = '';
        while (packet[pos] == '1') {
            s += packet.substr(pos+1, 4);
            pos += 5;
        }
        s += packet.substr(pos+1, 4);
        return parseInt(s, 2);
    }
    let mode = parseInt(packet.substr(6,1), 2), len, subPackets = [];
    if (mode == 0) {
        len = parseInt(packet.substr(7,15), 2);
        subPackets = packet.substr(22,len).match(new RegExp('.{1,'+11+'}', 'g'));
        if (subPackets[subPackets.length-1].length < 11) {
            let v2 = subPackets.pop(), v1 = subPackets.pop();
            subPackets.push(v1+v2);
        }
    } else {
        len = parseInt(packet.substr(7,11), 2);
        for (let i = 0 ; i < len; i++) subPackets.push(packet.substr(18+i*11,11));
    }
    console.log(mode, len);

    console.log(subPackets);
    subPackets.map(p => console.log('sp', p, decodePacket(p)));

}

//decodePacket(toBin(testInput3));
decodePacket(toBin('A0016C880162017C3686B18A3D4780'));
console.log('versions added', versionsAdded);