let data = [3,7], p1 = 0, p2 = 1;
let afterTick = 9;
//let afterTick = 540391;
let scoreTake = 10;

//let sequenceToFind = [5,1,5,8,9]; // 9
//let sequenceToFind = [5,9,4,1,4]; // 2018
//let sequenceToFind = [9,2,5,1,0]; // 18
let sequenceToFind = [5,4,0,3,9,1]; // my input

const tick = () => {
    let tmp = data[p1]+data[p2];
    if (tmp > 9) data.push(1);
    data.push(tmp % 10);
    let len = data.length;
    p1 = (p1+1+data[p1]) % len;
    p2 = (p2+1+data[p2]) % len;
}

const findInData = () => {
    if (data.length <= len) return -1;
    let dataSequence = [];
    for (let i = data.length-len-1;i<data.length-1;i++) dataSequence.push(data[i]);
    let match = true;

    for (let i = 0; i < len; i++) {
        match = match && (dataSequence[i] == sequenceToFind[i])
    }
    if (!match) return -1;
    return data.length-len-1;
}

let iterEnd = afterTick+scoreTake;
let len = sequenceToFind.length;

while(findInData() < 0) {
    findInData();
    tick();
}
console.log(findInData());

const getScore = () => {
    let score = '';
    for (let i = afterTick;i<afterTick+scoreTake;i++) {
        score = score+''+data[i];
    }
    return score;
}

//console.log('score', getScore(), data);