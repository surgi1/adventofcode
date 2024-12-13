let input = [11,30,47,31,32,36,3,1,5,3,32,36,15,11,46,26,28,1,19,3], loopEnd = Math.pow(2,input.length);
let pow2s = []; for (let n = 0; n < input.length; n++) pow2s[n] = Math.pow(2,n);

input.sort((a,b) => b-a);

const solve = (minContainers = input.length) => {
    let found = 0, part1Answer = 0;
    for (let i = 0; i < loopEnd; i++) {
        let sum = 0, containers = 0;
        for (let n = 0; n < input.length; n++) {
            if ((i & pow2s[n]) == pow2s[n]) {
                sum += input[n];
                containers++;
            }
            if (sum > 150) break;
        }
        if (sum == 150) {
            if (containers == minContainers) found++;
            minContainers = Math.min(containers, minContainers);
            part1Answer++;
        }
    }
    return {part1: part1Answer, minContainers: minContainers, part2: found}
}

let res = solve();
console.log('part 1', res.part1);
console.log('part 2', solve(res.minContainers).part2);