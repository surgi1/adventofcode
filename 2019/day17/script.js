var screen = [], pre, timerHandle, res;
var comp = new Computer();

var root = $('#root');
pre = $('<pre>');
root.append(pre);

comp.load(input);
var res = comp.run();

var s = '';
res.output.map(code => s += String.fromCharCode(code));
pre.append(s);

console.log('result', res);