const getHands = jokers => input.split("\n").map(line => {
    let tmp = line.split(' ');
    let vals = tmp[0].split('');
    let groups = [], str = 1;
    
    vals.forEach(v => {
        let g = groups.filter(g => g.val == v)?.[0];
        if (!g) groups.push({val: v, cnt: 1}); else g.cnt++;
    })

    groups.sort((a, b) => b.cnt - a.cnt);

    if (jokers && groups.length > 1) {
        // add J group to strongest group
        let jId = groups.findIndex(grp => grp.val == 'J');

        if (jId > -1) {
            groups[jId === 0 ? 1 : 0].cnt += groups[jId].cnt;
            groups.splice(jId, 1); // and remove it
        }
    }

    switch (groups.length) {
        case 1: str = 7; break;
        case 2: str = (groups[0].cnt == 4 ? 6 : 5); break;
        case 3: str = (groups[0].cnt == 3 ? 4 : 3); break;
        case 4: str = 2; break;
    }

    return {
        raw: tmp[0],
        bid: Number(tmp[1]),
        str: str,
    }
})

const solve = cardStr => getHands(cardStr.J === 1).sort((a, b) => {
    if (a.str != b.str) return a.str - b.str;
    for (let i = 0; i < 5; i++)
        if (a.raw[i] != b.raw[i]) return cardStr[a.raw[i]] - cardStr[b.raw[i]];
}).reduce((a, v, i) => a + (i+1)*v.bid, 0)

console.log('p1', solve({A: 14, K: 13, Q: 12, J:11, T: 10, 9: 9, 8: 8, 7: 7, 6: 6, 5: 5, 4: 4, 3: 3, 2: 2}));
console.log('p2', solve({A: 14, K: 13, Q: 12, J:1, T: 10, 9: 9, 8: 8, 7: 7, 6: 6, 5: 5, 4: 4, 3: 3, 2: 2}));