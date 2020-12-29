let haveOne = false,
    min = 2020;

arr.forEach(e => min = Math.min(min,e));

console.log('minimum', min);

arr.forEach(e1 => {
    if (haveOne) return;
    if (e1+min > 2020) return;
    arr.forEach(e2 => {
        if (haveOne) return;
        if (e1+e2+min > 2020) return;
        arr.forEach(e3 => {
            if (haveOne) return;
            if (e1+e2+e3 == 2020) {
                console.log('have one match', e1, e2, e3, e1+e2+e3, e1*e2*e3);
                let haveOne = true;
            }
        })
    })
})