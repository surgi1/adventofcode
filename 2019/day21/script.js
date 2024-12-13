let pre, res;
let comp = new Computer();

let root = $('#root');
pre = $('<pre>');
root.append(pre);

const str2command = s => {
    let res = [];
    for (let i = 0; i < s.length; i++) {
        res.push(s.charCodeAt(i));
    }
    res.push(10);
    return res;
}

const str2ascii = s => {
    return str2command(s).join(',');
}

const tick = pars => {
    if (!pars) pars = [];
    let res = comp.run(pars);

    let s = '';
    res.output.map(code => s += String.fromCharCode(code));
    pre.html(s);

    console.log('result', res);
}

const command = com => {
    if (Array.isArray(com)) {
        com.map(c => {
            tick(str2command(c));
        })
    } else {
        tick(str2command(com));
    }
}

const textareaValue = () => {
    return $('#code').val().split(/\n/).filter(l => l.length != 0)
}

const initGUI = () => {
    $('button').on('click', e => {
        let arr = textareaValue();
        arr.push(e.target.innerText);
        comp.reset();
        console.log('running commands', arr);
        command(arr);
    })
}

initGUI();
comp.load(input);
tick();

/*
p1 script:

NOT D T
OR C T
NOT T J
NOT A T
OR T J
WALK

p2 script:

NOT C J 
AND D J 
AND H J
NOT B T 
AND D T 
OR T J
NOT A T 
OR T J
RUN
*/