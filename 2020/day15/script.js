var data = [2,20,0,4,1,17];
//var stopNr = 2020; // p1
var stopNr = 30000000; // p2

var history = [];
var len = data.length;
var last;

for (var i = 0; i < stopNr; i++) {
    if (i % 100000 == 0) console.log('Mticks', i/1000000);
    if (i < len) {
        last = data[i];
        history[last] = [i];
        continue;
    }

    var num = 0;
    if (history[last].length > 1) num = history[last][1]-history[last].shift();

    if (!history[num]) history[num] = [];
    history[num].push(i);

    last = num;
}

console.log(last);
