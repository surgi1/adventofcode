let a = [],
    l = Math.round(arr.length/4);

for (let i=0; i<l; i++) {
    let o = {
        min: arr[i*4+0],
        max: arr[i*4+1],
        char: arr[i*4+2],
        pwd: arr[i*4+3]
    };
    a.push(o);
}

console.log('a', a);

const countCharInString = (char, s) => {
    let count = 0;
    for (let i=0; i< s.length; i++) {
        if (s[i] == char) count++;
    }
    return count;
}

corrects = 0;

// p1
/*a.forEach(e => {
    let cnt = countCharInString(e.char, e.pwd);
    if (cnt >= e.min && cnt <= e.max) corrects++;
})*/

// p2
a.forEach(e => {
    let c1 = e.pwd.charAt(e.min-1);
    let c2 = e.pwd.charAt(e.max-1);
    if ( (c1 == e.char && c2 != e.char) || (c2 == e.char && c1 != e.char) ) corrects++;
})

console.log('correct passwords count', corrects);