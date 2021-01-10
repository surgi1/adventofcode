const aCode = 'a'.charCodeAt(0);
const caesarShift = (letter, shift) => String.fromCharCode(aCode + ((letter.charCodeAt(0)-aCode + shift) % 26))

input.map(room => {
    var tmp = {};
    room.name.split('').filter(l => l != '-').map(l => {
        if (!tmp[l]) tmp[l] = 0;
        tmp[l]++;
    })
    room.histogram = tmp;
})

let count = 0;
input.map(room => {
    let arr = [];
    Object.entries(room.histogram).map(([l, c]) => arr.push({l:l, c:c}))
    arr.sort((a, b) => {
        if (a.c == b.c) {
            return a.l.localeCompare(b.l)
        } else {
            return b.c-a.c
        }
    })
    let s = '';
    for (let i = 0; i < 5; i++) s += arr[i].l;
    if (s == room.checksum) {
        count += parseInt(room.sectorId);
        room.valid = true;
    }
})

console.log(count); // p1

input.filter(room => room.valid).map(room => {
    let decryptedName = '';
    room.name.split('').filter(l => {
        if (l == '-' ) decryptedName += ' '; else decryptedName += caesarShift(l, parseInt(room.sectorId));
    })
    if (decryptedName.indexOf('north') > -1) console.log(room.sectorId, decryptedName);
})