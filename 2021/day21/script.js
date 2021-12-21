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
6: 6,
7: 6,
8: 3,
9: 1
}

let wins = [0,0];
const nextRolls = (p, s, t, timesThisHappened) => {
    //console.log('running nextrolls', p, s, t, timesThisHappened);
    let pId = t % 2;
    for (let i = 3; i <= 9; i++) {
        let newP = p.slice(), newS = s.slice(), newTimes = timesThisHappened.slice(), stop = false;
        newP[pId] = (newP[pId]+i) % 10;
        newS[pId] = newP[pId]+1;
        newTimes[pId] = newTimes[pId]*freq[i];
        if (newS[pId] >= 21) {
            wins[pId] += newTimes[pId];
            stop = true;
        }
        
        if (!stop && t < 11) nextRolls(newP, newS, t+1, newTimes);
    }
};

nextRolls([8-1, 4-1], [0, 0], 0, [1,1]);

console.log(wins);


/*
in the next 3 rolls, what can be the sum of the rolls and how many times it will be so
3: 1
4: 3
5: 6 [311, 131, 113, 122, 212, 221]
6: 6 [321, 312, 123, 132, 231, 213]
7: 6 [331, 313, 133, 322, 232, 223]
8: 3
9: 1
*/