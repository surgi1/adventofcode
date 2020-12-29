let colors = [];
const canCarryColor = (c, ref) => {
    let res = false;
    data[c].forEach(o => {
        if (o.name == ref) res = true;
    })
    return res;
}

const traverseUpwards = (col) => {
    Object.keys(data).map(k => {
        if (canCarryColor(k, col)) {
            if (!colors.includes(k)) {
                colors.push(k);
                traverseUpwards(k);
            }
        }
    })
}

//traverseUpwards('shinygold');
//console.log('found colors that can contain shinygold', colors, colors.length);

const bagsInColor = (color) => {
    let cnt = 0;
    data[color].forEach(o => {
        cnt = cnt+o.amount*(bagsInColor(o.name)+1);
    })
    return cnt;
}

let bags = bagsInColor('shinygold');
console.log('bags in shinygold bag', bags);