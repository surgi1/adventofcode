var pre, res;
var comp = new Computer();

var root = $('#root');
pre = $('<pre>');
root.append(pre);

function str2command(s) {
    var res = [];
    for (var i = 0; i < s.length; i++) {
        res.push(s.charCodeAt(i));
    }
    res.push(10);
    return res;
}

function str2ascii(s) {
    return str2command(s).join(',');
}

function tick(pars) {
    if (!pars) pars = [];
    var res = comp.run(pars);

    var s = '';
    res.output.map(code => s += String.fromCharCode(code));
    pre.html(s);

    console.log('result', res);
}

function command(com) {
    if (Array.isArray(com)) {
        com.map(c => {
            tick(str2command(c));
        })
    } else {
        tick(str2command(com));
    }
}

function textareaValue() {
    return $('#code').val().split(/\n/).filter(l => l.length != 0)
}

function initGUI() {
    $('button').on('click', e => {
        var arr = textareaValue();
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
// p1
NOT D T
OR C T
NOT T J
NOT A T
OR T J

// p2
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