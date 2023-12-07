// p2
const cardStr = {
    A: 14, K: 13, Q: 12, J:1, T: 10, 9: 9, 8: 8, 7: 7, 6: 6, 5: 5, 4: 4, 3: 3, 2: 2
}

let hands = [];
input.split("\n").map(line => {
    let tmp = line.split(' ');
    let vals = tmp[0].split('');
    let groups = [];
    
    vals.forEach(v => {
        let g = groups.filter(g => g.val == v)?.[0];
        if (!g) groups.push({val: v, cnt: 1}); else g.cnt++;
    })

    groups.sort((a, b) => b.cnt - a.cnt);

    // add J group to strongest group
    let jId = false;
    groups.forEach((grp, i) => {
        if (grp.val == 'J') jId = i
    });

    if (jId !== false && groups.length > 1) {
        groups[jId === 0 ? 1 : 0].cnt += groups[jId].cnt;
        groups.splice(jId, 1);
    }

    let str;
    switch (groups.length) {
        case 1: str = 7; break;
        case 2: str = (groups[0].cnt == 4 ? 6 : 5); break;
        case 3: str = (groups[0].cnt == 3 ? 4 : 3); break;
        case 4: str = 2; break;
        case 5: str = 1; break;
    }
    
    hands.push({
        raw: tmp[0],
        bid: Number(tmp[1]),
        groups: groups,
        str: str,
    })
})

hands.sort((a, b) => {
    if (a.str != b.str) return a.str-b.str;
    for (let i = 0; i < 5; i++)
        if (a.raw[i] != b.raw[i]) return cardStr[a.raw[i]] - cardStr[b.raw[i]];
})

console.log( hands.reduce((a, v, i) => a + (i+1)*v.bid, 0) )