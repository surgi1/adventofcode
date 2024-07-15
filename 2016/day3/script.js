Object.defineProperty(Array.prototype, 'chunk', {
    value: function(chunkSize) {
        let res = [];
        for (let i = 0; i < this.length; i += chunkSize) res.push(this.slice(i, i + chunkSize));
        return res;
    }
});

const transpose = arr => arr[0].map((col, i) => arr.map(row => row[i]))

const run = (preprocess = a => a) => preprocess(input.split('\n').map(line => line.match(/\d+/g).map(Number)))
  .flat()
  .chunk(3)
  .map(subArr => subArr.sort((a, b) => a-b)).filter(v => v[0]+v[1] > v[2]).length;

console.log('p1', run());
console.log('p2', run(transpose));
