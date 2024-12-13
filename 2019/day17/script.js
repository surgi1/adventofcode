// check initstate.txt for path routine creation (it is manual)
let pre, res;
let comp = new Computer();

let root = $('#root');
pre = $('<pre>');
root.append(pre);

input[0] = 2;

const str2ascii = (s) => {
    let res = [];
    for (let i = 0; i < s.length; i++) {
        res.push(s.charCodeAt(i));
    }
    res.push(10);
    return res.join(',');
}

const tick = (pars) => {
    if (!pars) pars = [];
    let res = comp.run(pars);

    let s = '';
    res.output.map(code => s += String.fromCharCode(code));
    pre.html(s);

    console.log('result', res);
}

comp.load(input);

tick();