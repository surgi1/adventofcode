let boxes = Array.from({length: 256}, () => new Map());

const hash = (word, cur = 0) => word.split('').reduce((a, s) => 17*(a + s.charCodeAt(0)) % 256, 0)

console.log('p1', input.split(',').reduce((res, word) => res + hash(word), 0))

input.split(',').forEach(cmd => {
    let [lab, val] = cmd.split(/-|=/g);
    if (val == '') 
        boxes[hash(lab)].delete(lab);
    else 
        boxes[hash(lab)].set(lab, Number(val))
})

console.log('p2', boxes.reduce((res, box, i) => res + [...box.entries()].reduce((sum, [lab, val], j) => sum + (i+1) * (j+1) * val, 0), 0))