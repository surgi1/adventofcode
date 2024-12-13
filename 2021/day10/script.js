const corruptedKetScore = {
    ')': 3,
    ']': 57,
    '}': 1197,
    '>': 25137
}

const ket2bra = {
    ')': '(',
    ']': '[',
    '}': '{',
    '>': '<'
}

const incompletedBraScore = {
    '(': 1,
    '[': 2,
    '{': 3,
    '<': 4
}

let corruptedScore = 0, incompletedScores = [];

input.map(line => {
    let stack = [], corrupted = false;
    line.split('').some(c => {
        if (']>})'.includes(c)) {
            if ((stack.length == 0) || (stack.pop() != ket2bra[c])) {
                corruptedScore += corruptedKetScore[c];
                corrupted = true;
                return true;
            }
        } else stack.push(c);
    })
    if (!corrupted) incompletedScores.push(stack.reverse().reduce((score, c) => score*5 + incompletedBraScore[c], 0))
})

console.log(corruptedScore);
console.log(incompletedScores.sort((a,b) => a-b)[Math.floor(incompletedScores.length/2)]);
