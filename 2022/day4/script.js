let p1 = 0, p2 = 0;
input.split("\n").map(l => {
    let e = l.split(',').map(i => i.split('-').map(Number));
    if ( (e[0][0] >= e[1][0] && e[0][1] <= e[1][1]) || (e[1][0] >= e[0][0] && e[1][1] <= e[0][1]) ) p1++;
    if (!((e[0][1] < e[1][0]) || (e[1][1] < e[0][0]))) p2++;
})

console.log(p1, p2);