let a = [], l = Math.round(arr.length/4), corrects;

for (let i = 0; i < l; i++) a.push({
    min: arr[i*4+0],
    max: arr[i*4+1],
    char: arr[i*4+2],
    pwd: arr[i*4+3]
});

const countCharInString = (char, s) => s.split('').reduce((a, e) => a+(e == char), 0);

corrects = 0;
a.map(e => {
    let cnt = countCharInString(e.char, e.pwd);
    if (cnt >= e.min && cnt <= e.max) corrects++;
})
console.log('part 1', corrects);

corrects = 0;
a.map(e => {
    let c1 = e.pwd.charAt(e.min-1), c2 = e.pwd.charAt(e.max-1);
    if ((c1 == e.char && c2 != e.char) || (c2 == e.char && c1 != e.char)) corrects++;
})
console.log('part 2', corrects);