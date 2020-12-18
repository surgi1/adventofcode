var layers = [];
var width = 25, height = 6;

var nrOfLayers = input.length/(width*height);
var i = 0;
while(i < nrOfLayers) {
    layers.push(
        input.substr( i*width*height, width*height )
    )
    i++;
}

function countChars(s, ch) {
    var count = 0;
    var len = s.length;
    for (var i = 0; i < len; i++) {
        if (s[i] == ch) count++;
    }
    return count;
}
// p1
/*
var min = layers[0].length;
for (var i = 0; i < layers.length; i++) {
    var countZero = countChars(layers[i], '0');
    if (countZero < min) {
        min = countZero;
        console.log('found new minimum', min, 'result', countChars(layers[i], '1')*countChars(layers[i], '2'))
    }
}
*/

var resultingLayer = '';
var len = layers[0].length;

for (var i = 0; i < len; i++) {
    layers.some(layer => {
        if (layer[i] != '2') {
            resultingLayer += layer[i];
            return true;
        }
    })
}

console.log(resultingLayer);