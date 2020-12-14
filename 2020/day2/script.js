var a = [],
    l = Math.round(arr.length/4);

for (var i=0; i<l; i++) {
    var o = {
        min: arr[i*4+0],
        max: arr[i*4+1],
        char: arr[i*4+2],
        pwd: arr[i*4+3]
    };
    a.push(o);
}

console.log('a', a);

function countCharInString(char, s) {
    var count = 0;
    for (var i=0; i< s.length; i++) {
        if (s[i] == char) count++;
    }
    return count;
}

corrects = 0;

// p1
/*a.forEach(e => {
    var cnt = countCharInString(e.char, e.pwd);
    if (cnt >= e.min && cnt <= e.max) corrects++;
})*/

// p2
a.forEach(e => {
    var c1 = e.pwd.charAt(e.min-1);
    var c2 = e.pwd.charAt(e.max-1);
    if ( (c1 == e.char && c2 != e.char) || (c2 == e.char && c1 != e.char) ) corrects++;
})

console.log('correct passwords count', corrects);