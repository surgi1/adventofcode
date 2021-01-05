const input = 265149;

const sumAdjacent = (map, xx, yy) => {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        let y = yy+i;
        for (let j = -1; j <= 1; j++) {
            let x = xx+j;
            if (map[y][x] != undefined) count += map[y][x];
        }
    }
    return count;
} 

let map = [], map2 = [], size = 101, p = {x: 50, y: 50},
    filled = 0, currentSquareSize = 1, currentSquareArea = 1;

for (let y = 0; y < size; y++) {
    map[y] = [];
    map2[y] = [];
}

while (filled < 1000) {
    map[p.y][p.x] = filled+1;
    if (filled == 0) {
        map2[p.y][p.x] = 1;
    } else {
        let sum = sumAdjacent(map2, p.x, p.y);
        map2[p.y][p.x] = sum;
        if (sum > input) {
            console.log(sum)
            break;
        }
    }
    filled++;
    if (filled == currentSquareArea) {
        currentSquareSize += 2;
        currentSquareArea = currentSquareSize*currentSquareSize;
        p.x++;
    } else {
        // spiral movement here
        let lastSq = (currentSquareSize-2)*(currentSquareSize-2);
        let dif = (currentSquareArea - lastSq)/4;
        let pos = Math.ceil(((filled+1)-lastSq) / dif);
        if (pos <= 1) p.y--;
        if (pos == 2) p.x--;
        if (pos == 3) p.y++;
        if (pos == 4) p.x++;
    }
}

console.log(map);
console.log(map2);