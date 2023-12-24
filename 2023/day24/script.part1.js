let arr = input.split("\n").map(line => {
    let [pLit, vLit] = line.split('@');
    return {
        p: pLit.split(',').map(Number),
        v: vLit.split(',').map(Number)
    }
})

const intersect = (a, b) => {
    let x1 = a.p[0], y1 = a.p[1], x2 = a.p[0] + a.v[0], y2 = a.p[1] + a.v[1];
    let x3 = b.p[0], y3 = b.p[1], x4 = b.p[0] + b.v[0], y4 = b.p[1] + b.v[1];

    let ua, ub, denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
    
    if (denom == 0) return false;
    
    ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
    ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom;
    
    return [
        x1 + ua * (x2 - x1),
        y1 + ua * (y2 - y1)
    ];
}

const getTime = (a, v) => {
    // a.p[0] + t*a.v[0] = x
    return (v - a.p[0]) / a.v[0];
}

//let from = 7, to = 27;
let from = 200000000000000, to = 400000000000000;

console.log(arr);

let res = 0;

let verbose = false;

for (let i = 0; i < arr.length; i++) {
    for (let j = i+1; j < arr.length; j++) {
        let int = intersect(arr[i], arr[j]);
        if (int !== false) {
            if (getTime(arr[i], int[0]) > 0 && getTime(arr[j], int[0]) > 0) {
                if (int[0] >= from && int[0] <= to && int[1] >= from && int[1] <= to) {
                    verbose && console.log(i, j, 'intersect within bounds', int);
                    res++;
                } else {
                    verbose && console.log(i, j, 'intersect outside bounds', int);
                }
            } else {
                verbose && console.log(i, j, 'in the past');
            }
        } else {
            verbose && console.log(i, j, 'parallel');
        }
    }
}

console.log('p1', res);
