var input = [11,30,47,31,32,36,3,1,5,3,32,36,15,11,46,26,28,1,19,3]

var loopEnd = Math.pow(2,input.length);

var pow2s = [];
for (var n = 0; n < input.length; n++) pow2s[n] = Math.pow(2,n);

input.sort((a,b) => {
    return b-a;
})

var found = 0;
var minContainers = input.length;
minContainers = 4;

for (var i = 0; i < loopEnd; i++) {
    var sum = 0;var containers = 0;
    for (var n = 0; n < input.length; n++) {
        if ((i & pow2s[n]) == pow2s[n]) {
            sum += input[n];
            containers++;
        }
        if (sum > 150) break;
    }
    if (sum == 150 && containers == 4) {
        found++;
        //minContainers = Math.min(minContainers, containers);
    }
}

console.log('min containers', minContainers);
console.log(found);