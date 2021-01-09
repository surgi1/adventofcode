let colors = [];
const canCarryColor = (c, ref) => {
    let res = false;
    data[c].some(o => {
        if (o.name == ref) {
            res = true;
            return true;
        }
    })
    return res;
}

const traverseUpwards = col => Object.keys(data).map(k => {
    if (canCarryColor(k, col)) {
        if (!colors.includes(k)) {
            colors.push(k);
            traverseUpwards(k);
        }
    }
})

const bagsInColor = color => data[color].reduce((a, o) => a+o.amount*(bagsInColor(o.name)+1), 0);

traverseUpwards('shinygold');
console.log('part 1', colors.length);
console.log('part 2', bagsInColor('shinygold'));