let colors = [];

const canCarryColor = (k, color) => data[k].filter(o => o.name == color).length > 0
const bagsInColor = color => data[color].reduce((a, o) => a+o.amount*(bagsInColor(o.name)+1), 0);
const traverseUp = color => Object.keys(data)
    .filter(k => canCarryColor(k, color))
    .map(k => {
        if (!colors.includes(k)) {
            colors.push(k);
            traverseUp(k);
        }
    })

traverseUp('shinygold');
console.log('part 1', colors.length);
console.log('part 2', bagsInColor('shinygold'));