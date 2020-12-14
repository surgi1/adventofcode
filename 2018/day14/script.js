var data = [3,7],p1 = 0,p2 = 1;
var afterTick = 9;
//var afterTick = 540391;
var scoreTake = 10;

var sequenceToFind = [5,1,5,8,9]; // 9
var sequenceToFind = [5,9,4,1,4]; // 2018
var sequenceToFind = [9,2,5,1,0]; // 18
var sequenceToFind = [5,4,0,3,9,1];

function tick() {
    var tmp = data[p1]+data[p2];
    if (tmp > 9) data.push(1);
    data.push(tmp % 10);
    var len = data.length;
    p1 = (p1+1+data[p1]) % len;
    p2 = (p2+1+data[p2]) % len;
}

var iterEnd = afterTick+scoreTake;
var len = sequenceToFind.length;

/*while(data.length < iterEnd) {
    tick();
}*/

while(findInData() < 0) {
//while(data.length < iterEnd) {
    findInData();
    tick();
}
console.log(findInData());

function findInData1() {
    if (data.length < len) return -1;
    var dataSequence = [];
    for (var i = data.length-len;i<data.length;i++) dataSequence.push(data[i]);
    var match = true;
    
    //console.log('about to compare', sequenceToFind, dataSequence, data);

// neco je velmi spatne; kdyz o radek niz bude "len-1" misto "len", tedy chybne, najdu vysledek "49774641", ktery je ale spatne - too high! takze vejs to nebude
    for (var i = 0; i < len; i++) {
        match = match && (dataSequence[i] == sequenceToFind[i])
    }
    if (!match) return -1;
    return data.length-len;
}

function findInData() {
    if (data.length <= len) return -1;
    var dataSequence = [];
    for (var i = data.length-len-1;i<data.length-1;i++) dataSequence.push(data[i]);
    var match = true;
    
    //console.log('about to compare', sequenceToFind, dataSequence, data);

// neco je velmi spatne; kdyz o radek niz bude "len-1" misto "len", tedy chybne, najdu vysledek "49774641", ktery je ale spatne - too high! takze vejs to nebude
    for (var i = 0; i < len; i++) {
        match = match && (dataSequence[i] == sequenceToFind[i])
    }
    if (!match) return -1;
    return data.length-len-1;
}


function getScore() {
    var score = '';
    for (var i = afterTick;i<afterTick+scoreTake;i++) {
        score = score+''+data[i];
    }
    return score;
}

//console.log('score', getScore(), data);