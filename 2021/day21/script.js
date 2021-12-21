const part1 = () => {
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
6: 7,
7: 6,
8: 3,
9: 1
}

let wins = [0,0], stopping = 21;

const turn = (pId, sum, cnt, state) => {
    let newState = state.slice();
    newState[pId] = (state[pId]+sum) % 10;
    newState[pId+2] = state[pId+2]+newState[pId]+1;
    if (newState[pId+2] >= stopping) {
        wins[pId] += cnt;
        return;
    }
    Object.entries(freq).map(([sum, frq]) => {
        turn(pId == 0 ? 1 : 0, sum, frq*cnt, newState);
    })
}

const part2 = () => {
    Object.entries(freq).map(([sum, frq]) => {
        turn(0, sum, frq*1, [5-1, 10-1, 0, 0]);
    })
}

part2();
console.log(wins);

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

