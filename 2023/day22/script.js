// takes some time to process all the boxes
// todo: 3d animated!

let boxes = input.split("\n").map(line => line.split('~').map(c => c.split(',').map(Number)))
                 .sort((a, b) => b[1][2] - a[1][2]);

const getState = boxes => boxes.map(b => b[1][2]).join(',');

const fall = boxes => {
    boxes.forEach((b, i) => {
        if (b[1][2] <= 1) return true;

        let z = b[0][2],
            canFall = true;

        while (canFall && z > 1) {
            z--;
            for (let x = b[0][0]; x <= b[1][0]; x++) for (let y = b[0][1]; y <= b[1][1]; y++) {
                if (boxes.filter((o, j) => i !== j && o[0][0] <= x && o[1][0] >= x && o[0][1] <= y && o[1][1] >= y && o[0][2] <= z && o[1][2] >= z ).length != 0) {
                    canFall = false;
                    break;
                }
            }
            if (canFall) {
                b[1][2]--;
                b[0][2]--;
                fallen.add(i);
            }
        }
    })
}

const fallFull = boxes => {
    let state = '';
    while (state !== getState(boxes)) {
        state = getState(boxes);
        fall(boxes);
    }
    return state;
}

let fallen = new Set(),
    p1 = 0, p2 = 0;

fallFull(boxes);

boxes.forEach((b, i) => {
    console.log(i);
    fallen = new Set();
    let nboxes = JSON.parse(JSON.stringify(boxes));
    nboxes.splice(i, 1);
    let state = getState(nboxes);
    if (fallFull(nboxes) === state) p1++;
    p2 += fallen.size;
})

console.log('p1', p1);
console.log('p2', p2);
