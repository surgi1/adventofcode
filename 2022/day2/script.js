const ind = {A: 0, B: 1, C: 2, X: 0, Y: 1, Z: 2}
const desiredGameScore = [0, 3, 6];
const gameScore = [
    [3, 6, 0],
    [0, 3, 6],
    [6, 0, 3]];

const totalScore = (p2 = false) => input.split("\n").reduce((a, row) => {
    let i = row.split(' ').map(n => ind[n]);
    if (p2) i[1] = gameScore[i[0]].indexOf(desiredGameScore[i[1]]);
    return a + i[1]+1 + gameScore[i[0]][i[1]];
}, 0)

console.log(totalScore());
console.log(totalScore(true));
