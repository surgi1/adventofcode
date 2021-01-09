const validateEntryPart1 = e => {
    let valid = true;
    if (!e.byr) valid = false;
    if (!e.iyr) valid = false;
    if (!e.eyr) valid = false;
    if (!e.hgt) valid = false;
    if (!e.ecl) valid = false;
    if (!e.hcl) valid = false;
    if (!e.pid) valid = false;
    return valid;
}

const validateEntryPart2 = e => {
    let valid = true;
    if (!e.byr) valid = false;
    if (!e.iyr) valid = false;
    if (!e.eyr) valid = false;
    if (!e.hgt) valid = false;
    if (!e.ecl) valid = false;
    if (!e.hcl) valid = false;
    if (!e.pid) valid = false;

    if (e.byr) {
        if (!e.byr.match(/^\d{4}$/)) valid = false;
        if (e.byr < 1920 || e.byr > 2002) valid = false;
    }
    if (e.iyr) {
        if (!e.iyr.match(/^\d{4}$/)) valid = false;
        if (e.iyr < 2010 || e.iyr > 2020) valid = false;
    }
    if (e.eyr) {
        if (!e.eyr.match(/^\d{4}$/)) valid = false;
        if (e.eyr < 2020 || e.eyr > 2030) valid = false;
    }
    if (e.hgt) {
        let r = e.hgt.match(/^[\d]*(in|cm)$/);
        if (!r) valid = false; else {
            let v = parseFloat(e.hgt);
            if (r[1] == 'cm') {
                if (v < 150 || v > 193) valid = false;
            } else if (r[1] == 'in') {
                if (v < 59 || v > 76) valid = false;
            }
        } 
        
    }
    if (e.hcl) {
        if (!e.hcl.match(/^#[a-f\d]{6}$/)) valid = false;
    }
    if (e.ecl) {
        if (!['amb','blu','brn','gry','grn','hzl','oth'].includes(e.ecl)) valid = false;
    }
    if (e.pid) {
        if (!e.pid.match(/^\d{9}$/)) valid = false;
    }
    return valid;
}

console.log('part 1', data.filter(validateEntryPart1).length);
console.log('part 2', data.filter(validateEntryPart2).length);
