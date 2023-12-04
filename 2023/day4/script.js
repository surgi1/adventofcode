let p1 = 0, arr = input.split("\n"),
    copies = Array(arr.length).fill(1);

arr.forEach((line, i) => {
    let [cId, win, have] = line.split(/:|\|/).map(s => s.match(/\d+/g).map(Number)),
        score = have.filter(n => win.includes(n)).length;

    if (score > 0) p1 += Math.pow(2, score-1);
    for (let j = 1; j <= score; j++) copies[i+j] += copies[i];
})

console.log(p1);
console.log(copies.reduce((a, v) => a+v, 0));