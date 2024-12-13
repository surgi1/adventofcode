let layers = [];
let width = 25, height = 6;

let nrOfLayers = input.length/(width*height);
let i = 0;
while(i < nrOfLayers) {
    layers.push(
        input.substr( i*width*height, width*height )
    )
    i++;
}

const countChars = (s, ch) => {
    let count = 0;
    let len = s.length;
    for (let i = 0; i < len; i++) {
        if (s[i] == ch) count++;
    }
    return count;
}
// p1
/*
let min = layers[0].length;
for (let i = 0; i < layers.length; i++) {
    let countZero = countChars(layers[i], '0');
    if (countZero < min) {
        min = countZero;
        console.log('found new minimum', min, 'result', countChars(layers[i], '1')*countChars(layers[i], '2'))
    }
}
*/

let resultingLayer = '';
let len = layers[0].length;

for (let i = 0; i < len; i++) {
    layers.some(layer => {
        if (layer[i] != '2') {
            resultingLayer += layer[i];
            return true;
        }
    })
}

console.log(resultingLayer.replace(/(.{25})/g, "$1\n").replace(/0/g, " "));