const parse = input => input.split('\n').map(line => {
    let tmp = line.match(/\d+/g).map(Number);
    let width = tmp.shift();
    let height = tmp.shift();
    return {
        width: width,
        height: height,
        counts: tmp
    }
})

// upper bound is just counting the necessary space, forget about the shapes
// when tested with what I think is a sufficient extra space, it still yields the same result, so I went for it as an answer..

let shapeSizes = [7, 7, 7, 6, 7, 5];
let shapeSizeFull = 9;

const run = (data) => data.filter((space, id) => {
    let maxOccupied = space.counts.reduce((a, v, i) => a + v * shapeSizeFull, 0);
    let minOccupied = space.counts.reduce((a, v, i) => a + v * shapeSizes[i], 0);    
    let area = space.width * space.height;
    if (area < maxOccupied && area >= minOccupied) console.log('Undetermined shape, naive method failed', id);
    return area >= maxOccupied;
}).length

console.log('p1', run(parse(input)));
