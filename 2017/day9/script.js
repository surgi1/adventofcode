let arr = input.split(''), part2 = 0;

while (arr.indexOf('!') > -1)  arr.splice(arr.indexOf('!'), 2);

while (arr.indexOf('<') > -1) {
    let i = arr.indexOf('<');
    let removed = arr.splice(i, arr.indexOf('>', i)-i+1);
    part2 += removed.join('').length-2;
}

console.log('part 2', part2);

let s = arr.join(''), level = 0, sum = 0;

for (let i = 0; i < s.length; i++) {
    if (s[i] == '{') {
        level++;
        sum += level;
    }
    if (s[i] == '}') level--;
}

console.log('part 1', sum)
