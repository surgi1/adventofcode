let boxes = Array.from({length: 256}, () => []);

const hash = (word, cur = 0) => word.split('').reduce((a, s) => 17*(a + s.charCodeAt(0)) % 256, 0)

console.log('p1', input.split(',').reduce((res, word) => res + hash(word), 0))

input.split(',').forEach(cmd => {
    let [label, val] = cmd.split(/-|=/g);
    let boxNr = hash(label);
    if (val == '') 
        boxes[boxNr] = boxes[boxNr].filter(o => o.label !== label); // minus op
    else {
        // equals op
        let len = boxes[boxNr].filter(o => o.label == label)?.[0];
        if (len) len.val = Number(val); else boxes[boxNr].push({ label: label, val: Number(val) })
    }
})

console.log('p2', boxes.reduce((res, box, i) => res + box.reduce((a, len, j) => a + (i+1)*(j+1)*len.val, 0), 0));