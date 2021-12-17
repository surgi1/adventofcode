const txMin = 192, txMax = 251, tyMin = -89, tyMax = -59;
let totalMaxY = 0, foundVs = 0;

const trajectory = (vx, vy) => {
    let x = 0, y = 0, maxY = 0, hit = false;
    while (x < txMax && y > tyMin) {
        x += vx;
        y += vy;
        if (vx != 0) vx--;
        vy--;
        if (y > maxY) maxY = y;
        if (x >= txMin && x <= txMax && y >= tyMin && y <= tyMax) {hit = true; break;}
    }
    return hit ? maxY : false;
}

for (let x = 1; x <= txMax; x++) for (let y = -1000; y < 1000; y++) {
    let res = trajectory(x, y);
    if (res !== false) foundVs++;
    if (res > totalMaxY) totalMaxY = res;
}

console.log(totalMaxY);
console.log(foundVs);