let p1 = 0, p2 = 0,
    arr = input.split("\n"),
    copies = Array(arr.length).fill(1);

arr.forEach((line, i) => {
    let [cardId, body] = line.split(': ');
    let [win, have] = body.split(' | ').map(s => s.match(/\d+/g).map(Number));

    let score = have.filter(n => win.includes(n)).length-1;

    if (score > -1) p1 += Math.pow(2, score);

    for (let cp = 0; cp < score+1; cp++) copies[i+1+cp] += copies[i];
})

console.log(p1);
console.log(copies.reduce((a, v) => a+v, 0));