var input = '942387615';
var list = [], currentId = 0, max, min = 1, labelToId = [],
    movesPart1 = 100, movesPart2 = 10000000, maxPart2 = 1000000;

function addNode(params) {
    var id = list.length;
    list.push({
        id: id,
        left: params.left,
        right: params.right,
        label: params.label,
        pickedUp: false
    })
    labelToId[params.label] = id;
}

function initList(s, genMax) {
    var len = s.length;
    if (!genMax) genMax = len;
    for (var i = 0; i < genMax; i++) addNode({
        left: i > 0 ? i-1 : genMax-1,
        right: i < genMax-1 ? i+1 : 0,
        label: (i < len ? parseInt(s[i]) : i+1)
    })
    max = genMax;
}

function right(node) {
    return list[node.right];
}

function left(node) {
    return list[node.left];
}

function connect(node1, node2) {
    node1.right = node2.id;
    node2.left = node1.id;
}

function move() {
    var current = list[currentId];
    var r1 = right(current), r2 = right(r1), r3 = right(r2);
    r1.pickedUp = true; r2.pickedUp = true; r3.pickedUp = true;

    connect(current, right(r3));

    // pick new destination
    var destinationLabel = current.label - 1;
    if (destinationLabel < min) destinationLabel = max;
    while (list[ labelToId[destinationLabel] ].pickedUp == true ) {
        destinationLabel--;
        if (destinationLabel < min) destinationLabel = max;
    }

    var destinationFrom = list[ labelToId[destinationLabel] ];
    var destinationTo = right(destinationFrom);

    connect(destinationFrom, r1);
    connect(r3, destinationTo);

    r1.pickedUp = false; r2.pickedUp = false; r3.pickedUp = false;

    currentId = right(list[currentId]).id;
}

function log(num, sep) {
    var s = '';
    if (!sep) sep = '';
    var n = right(list[labelToId[1]]);
    for (i = 0; i < num; i++) {
        s += (s != '' ? sep : '')+n.label;
        n = right(n);
    }
    return s;
}

function part1() {
    initList(input);
    for (var i = 0; i < movesPart1; i++) move();
    console.log(log(list.length-1));
}

function part2() {
    initList(input, maxPart2);
    for (var i = 0; i < movesPart2; i++) move();
    console.log(log(2, '*'));
}

//part1();
part2();