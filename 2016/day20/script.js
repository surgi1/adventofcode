const ipMin = 0, ipMax = 4294967295;

const checkIP = ip => {
    let valid = true;
    input.some(rule => {
        if (ip >= rule.from && ip <= rule.to) {
            valid = rule.to+1;
            return true;
        }
    })
    return valid;
}

let ip = ipMin, checkResult = false, allowedIPs = [];
while (ip <= ipMax) {
    checkResult = checkIP(ip);
    if (checkResult === true) {
        allowedIPs.push(ip);
        ip++;
    } else {
        ip = checkResult;
    }
}

console.log(allowedIPs[0]);
console.log(allowedIPs.length);