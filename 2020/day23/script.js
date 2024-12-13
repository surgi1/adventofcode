let input = '942387615', list, currentId, max, min = 1, labelToId = [],
    movesPart1 = 100, movesPart2 = 10000000, maxPart2 = 1000000;

const addNode = params => {
    let id = list.length;
    list.push({
        id: id,
        pickedUp: false,
        ...params
    })
    labelToId[params.label] = id;
}

const initList = (s, genMax = s.length) => {
    list = [], currentId = 0;
    let len = s.length;
    for (let i = 0; i < genMax; i++) addNode({
        left: i > 0 ? i-1 : genMax-1,
        right: i < genMax-1 ? i+1 : 0,
        label: (i < len ? parseInt(s[i]) : i+1)
    })
    max = genMax;
}

const right = node => list[node.right];
const left = node => list[node.left];

const connect = (node1, node2) => {
    node1.right = node2.id;
    node2.left = node1.id;
}

const move = () => {
    let current = list[currentId];
    let r1 = right(current), r2 = right(r1), r3 = right(r2);
    r1.pickedUp = true; r2.pickedUp = true; r3.pickedUp = true;

    connect(current, right(r3));

    // pick new destination
    let destinationLabel = current.label - 1;
    if (destinationLabel < min) destinationLabel = max;
    while (list[ labelToId[destinationLabel] ].pickedUp == true ) {
        destinationLabel--;
        if (destinationLabel < min) destinationLabel = max;
    }

    let destinationFrom = list[ labelToId[destinationLabel] ];
    let destinationTo = right(destinationFrom);

    connect(destinationFrom, r1);
    connect(r3, destinationTo);

    r1.pickedUp = false; r2.pickedUp = false; r3.pickedUp = false;

    currentId = right(list[currentId]).id;
}

const log = (num, sep = '') => {
    let s = [], n = right(list[labelToId[1]]);
    for (i = 0; i < num; i++) {
        s.push(n.label);
        n = right(n);
    }
    return s;
}

const part1 = () => {
    initList(input);
    for (let i = 0; i < movesPart1; i++) move();
    console.log(log(list.length-1).join(''));
}

const part2 = () => {
    initList(input, maxPart2);
    for (let i = 0; i < movesPart2; i++) move();
    console.log(log(2, '*').reduce((a,b) => a*b, 1));
}

part1();
part2();