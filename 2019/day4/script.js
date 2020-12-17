var minPwd = 367479;
var maxPwd = 893698;

var valids = []
for (var pwd = minPwd; pwd <= maxPwd; pwd++) {
    var valid = true;
    var s = pwd+'';
    if (!s.match(/([0-9])\1+/g) || s.match(/([0-9])\1+/g).filter(g => g.length == 2).length < 1) valid = false; // p2
    //if (!s.match(/(\d)\1/g)) valid = false; // p1
    for (var i = 1; i < s.length; i++) {
        if (parseInt(s[i]) < parseInt(s[i-1])) valid = false;
    }
    if (valid) valids.push(s);
}

console.log('valid passwords', valids.length, valids);
