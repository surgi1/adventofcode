var pre, res;
var comp = new Computer();

var root = $('#root');
pre = $('<pre>');
root.append(pre);

input[0] = 2;

function str2ascii(s) {
    var res = [];
    for (var i = 0; i < s.length; i++) {
        res.push(s.charCodeAt(i));
    }
    res.push(10);
    return res.join(',');
}

function tick(pars) {
    if (!pars) pars = [];
    var res = comp.run(pars);

    var s = '';
    res.output.map(code => s += String.fromCharCode(code));
    pre.html(s);

    console.log('result', res);
}

comp.load(input);

tick();