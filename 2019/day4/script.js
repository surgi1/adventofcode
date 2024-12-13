let minPwd = 367479;
let maxPwd = 893698;

let valids = []
for (let pwd = minPwd; pwd <= maxPwd; pwd++) {
    let valid = true;
    let s = pwd+'';
    if (!s.match(/([0-9])\1+/g) || s.match(/([0-9])\1+/g).filter(g => g.length == 2).length < 1) valid = false; // p2
    //if (!s.match(/(\d)\1/g)) valid = false; // p1
    for (let i = 1; i < s.length; i++) {
        if (parseInt(s[i]) < parseInt(s[i-1])) valid = false;
    }
    if (valid) valids.push(s);
}

console.log('valid passwords', valids.length, valids);
