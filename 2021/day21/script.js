const start = [5,10];

const part1 = () => {
    const stopping = 1000;
    let p = [start[0]-1, start[1]-1], s = [0,0], d = 0;
    while (Math.max(...s) < stopping) {
        let pId = Math.floor(d / 3) % 2;
        p[pId] = (p[pId]+d+1) % 10;
        if (d % 3 == 2) s[pId] += p[pId]+1;
        d++;
    }
    console.log(s, d);
}

const part2 = () => {
    const freq = {
        3: 1,
        4: 3,
        5: 6,
        6: 7,
        7: 6,
        8: 3,
        9: 1
    }
    const stopping = 21;
    let wins = [0,0];

    const turn = (pId, sum, cnt, pos, score) => {
        let newPos = pos.slice(), newScore = score.slice();
        newPos[pId] = (pos[pId]+sum) % 10;
        newScore[pId] += newPos[pId]+1;
        if (newScore[pId] >= stopping) {
            wins[pId] += cnt;
            return;
        }
        Object.entries(freq).forEach(([sum, frq]) => turn(pId == 0 ? 1 : 0, sum*1, frq*cnt, newPos, newScore))
    }

    Object.entries(freq).forEach(([sum, frq]) => turn(0, sum*1, frq, [start[0]-1, start[1]-1], [0, 0]))
    console.log(wins);
}

part1();
part2();

/*
in the next 3 rolls, what can be the sum of the rolls and how many times it will be so
3: 1 [111]
4: 3 [112, 121, 211]
5: 6 [311, 131, 113, 122, 212, 221]
6: 7 [321, 312, 123, 132, 231, 213, 222]
7: 6 [331, 313, 133, 322, 232, 223]
8: 3 [233, 323, 332]
9: 1 [333]
*/
