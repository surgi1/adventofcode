let input = [11,30,47,31,32,36,3,1,5,3,32,36,15,11,46,26,28,1,19,3]

let loopEnd = Math.pow(2,input.length);

let pow2s = [];
for (let n = 0; n < input.length; n++) pow2s[n] = Math.pow(2,n);

input.sort((a,b) => {
    return b-a;
})

let found = 0;
let minContainers = input.length;
minContainers = 4;

for (let i = 0; i < loopEnd; i++) {
    let sum = 0;let containers = 0;
    for (let n = 0; n < input.length; n++) {
        if ((i & pow2s[n]) == pow2s[n]) {
            sum += input[n];
            containers++;
        }
        if (sum > 150) break;
    }
    if (sum == 150 && containers == 4) {
        found++;
    }
}

console.log('min containers', minContainers);
console.log(found);