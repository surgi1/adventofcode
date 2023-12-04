let p1 = 0, p2 = 0, copies = [];
let arr = input.split("\n");

arr.forEach((line, i) => {
    let [cardId, body] = line.split(': ');
    let [win, have] = body.split(' | ').map(s => s.match(/\d+/g).map(Number));

    console.log(cardId, body, win, have);

    let score = -1;

    have.forEach(n => {
        if (win.includes(n)) score++;
    })

    if (score > -1) p1 += Math.pow(2, score);

    if (copies[i] === undefined) copies[i] = 1;

    for (let cp = 0; cp < score+1; cp++) {
        if (copies[i+1+cp] === undefined) copies[i+1+cp] = 1;
        copies[i+1+cp] += copies[i];
    }
})

console.log(p1);
console.log(copies.reduce((a, v) => a+v, 0));