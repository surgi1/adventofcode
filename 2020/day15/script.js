// p2 is pretty slow, around 7 minutes

var data = [2,20,0,4,1,17];
//var stopNr = 2020; // p1
var stopNr = 30000000; // p2

var history = [];
var len = data.length;

data.map((d,i) => history[d] = [i]);

var last = data.pop();

console.time('runtime');
for (var i = len; i < stopNr; i++) {
    var num = 0;
    if (history[last].length > 1) num = history[last][1]-history[last].shift();

    if (!history[num]) history[num] = [];
    history[num].push(i);

    last = num;
}
console.timeEnd('runtime');

console.log(last);
