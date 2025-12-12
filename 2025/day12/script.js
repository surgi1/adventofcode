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

const run = (data, extraSpaceRequired = 200) => data.filter(space => space.width * space.height - extraSpaceRequired >= space.counts.reduce((a, v, i) => a + v * shapeSizes[i], 0) ).length

console.log('p1', run(parse(input)));
