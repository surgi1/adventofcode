let arr = input.split("\n").map(line => {
    let [pLit, vLit] = line.split('@');
    return {
        p: pLit.split(',').map(Number),
        v: vLit.split(',').map(Number)
    }
})

const intersect = (a, b, shift = [0, 0], coords = [0, 1]) => {
    let x1 = a.p[coords[0]], y1 = a.p[coords[1]], x2 = a.p[coords[0]] + a.v[coords[0]] - shift[0], y2 = a.p[coords[1]] + a.v[coords[1]] - shift[1];
    let x3 = b.p[coords[0]], y3 = b.p[coords[1]], x4 = b.p[coords[0]] + b.v[coords[0]] - shift[0], y4 = b.p[coords[1]] + b.v[coords[1]] - shift[1];

    let ua, ub, denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
    if (denom == 0) return false;
    ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
    ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom;
    return [
        x1 + ua * (x2 - x1),
        y1 + ua * (y2 - y1)
    ];
}

const getTime = (a, v, shift = 0, coord = 0) => {
    return (v - a.p[coord]) / (a.v[coord] - shift);
}

const part1 = () => {
    //let from = 7, to = 27;
    let from = 200000000000000, to = 400000000000000;
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
    return res;
}

console.log('p1', part1());

// part 2 is bruteforce
// going thru all the velocities [-500, 500]^3
// it identifies candidates and a number of matches the algo was able to verify (other rocks likely match as well, but that is harder to verify due to (I guess) belonging to the same plane)
// this is to be improved / verified

let hits = 0;

for (let vz = -500; vz <= 500; vz++) {
    if ((vz + 1000) % 10 == 0) console.log('testing velocity z', vz);
    for (let vx = -500; vx <= 500; vx++) for (let vy = -500; vy <= 500; vy++) {
        // [vx, vy, vz] is the velocity of our rock
        // we substract rock velocity from each sandstone's velocity and look for common intersection
        let skip = false, t, masterInt, cnt = 0;

        for (let i = 0; i < arr.length; i++) {
            for (let j = i+1; j < arr.length; j++) {
                let intXY = intersect(arr[i], arr[j], [vx, vy], [0, 1]);
                let intYZ = intersect(arr[i], arr[j], [vy, vz], [1, 2]);
                let intXZ = intersect(arr[i], arr[j], [vx, vz], [0, 2]);

                let parallelCount = ([intXY, intYZ, intXZ].filter(o => o === false).length);
                if (parallelCount > 2) {
                    skip = true;
                    break;
                }

                let matches = 0, t, tj;

                if (intXY !== false) {
                    let t1 = getTime(arr[i], intXY[0], vx, 0);
                    if (isNaN(t1)) t1 = getTime(arr[i], intXY[1], vy, 1);

                    let t1j = getTime(arr[j], intXY[0], vx, 0);
                    if (isNaN(t1j)) t1j = getTime(arr[j], intXY[1], vy, 1);

                    if (t === undefined) t = t1;
                    if (tj === undefined) tj = t1j;

                    if (t1 > 0 && t1j > 0 && t == t1 && tj == t1j) matches++;
                }

                if (intYZ !== false) {
                    let t2 = getTime(arr[i], intYZ[0], vy, 1);
                    if (isNaN(t2)) t2 = getTime(arr[i], intYZ[1], vz, 2);

                    let t2j = getTime(arr[j], intYZ[0], vy, 1);
                    if (isNaN(t2j)) t2j = getTime(arr[j], intYZ[1], vz, 2);

                    if (t === undefined) t = t2;
                    if (tj === undefined) tj = t2j;

                    if (t2 > 0 && t2j > 0 && t == t2 && tj == t2j) matches++;
                }

                if (intXZ !== false) {
                    let t3 = getTime(arr[i], intXZ[0], vx, 0);
                    if (isNaN(t3)) t3 = getTime(arr[i], intXZ[1], vz, 2);

                    let t3j = getTime(arr[j], intXZ[0], vx, 0);
                    if (isNaN(t3j)) t3j = getTime(arr[j], intXZ[1], vz, 2);

                    if (t === undefined) t = t3;
                    if (tj === undefined) tj = t3j;

                    if (t3 > 0 && t3j > 0 && t == t3 && tj == t3j) matches++;
                }

                if (matches >= 2) cnt++; else {
                    skip = true;
                    break;
                }

                if (cnt >= 20 && parallelCount == 0) {
                    //console.log('a lot of intersections exist for', vx, vy, int);
                    masterInt = [intXY[0], intXY[1], intYZ[1]];
                }

            }
            if (skip) break;
        }

        if (masterInt !== undefined) {
            console.log('possible verified point', masterInt, 'velocities', vx, vy, vz, 'nr of hits', cnt, 'p2', masterInt.reduce((a, v) => a+v, 0));
            hits++;
        }
    }
}

console.log(hits);


// [420851642592931, 273305746686315, 176221626745613]
// 870379016024859 yay
// v: [-261, 15, 233]