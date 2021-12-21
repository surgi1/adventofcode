const part_1 = () => {
    let p = [5-1,10-1], s = [0,0], d = 0;
    while (Math.max(...s) < 1000) {
        let pId = Math.floor(d / 3) % 2;
        p[pId] = (p[pId]+d+1) % 10;
        if (d % 3 == 2) s[pId] += p[pId]+1;
        d++;
    }
    console.log(s, d);
}

//part1();

let freq = {
3: 1,
4: 3,
5: 6,
6: 6,
7: 6,
8: 3,
9: 1
}

let paths = [{p:[4-1,8-1], s:[0, 0], times: [1, 1]}]

let wins = [0,0];

let stopping = 21, ii = 0;

while (paths.length > 0) {
    let path = paths.pop();
    //console.log(path);
    for (let i = 3; i <= 9; i++) {
        for (let j = 3; j <= 9; j++) {
            let p = path.p.slice(), s = path.s.slice(), times = path.times.slice();
            p[0] = (p[0]+i) % 10;
            p[1] = (p[1]+j) % 10;
            s[0] += p[0]+1;
            s[1] += p[1]+1;
            times[0] *= freq[i];
            times[1] *= freq[j];
            // heres a gap, if we find out that we do hav a winner, we must be more precise in this whole step and simulate exactly how many times from all the combinations has the victory been rached by each player
            if ((s[0] >= stopping) || (s[1] >= stopping)) {
                let winnerId = s[0] > s[1] ? 0 : 1;
                wins[winnerId] += times[winnerId];
                //console.log('winner', {p:p, s:s, times:times}, wins, ii);
                ii++;
            } else {
                paths.push({p:p, s:s, times:times})
            }
        }
    }
    //console.log(paths.length);
}

console.log(wins);

/*
in the next 3 rolls, what can be the sum of the rolls and how many times it will be so
3: 1 [111]
4: 3 [112, 121, 211]
5: 6 [311, 131, 113, 122, 212, 221]
6: 6 [321, 312, 123, 132, 231, 213]
7: 6 [331, 313, 133, 322, 232, 223]
8: 3 [233, 323, 332]
9: 1 [333]
*/

