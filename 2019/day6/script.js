var nodes = [];

function addNode(value, parentNode) {
    nodes.push({
        id: nodes.length,
        value: value,
        parentId: parentNode?.id
    })
}

function getNodeByValue(value) {
    var found = false;
    nodes.some(n => {
        if (n.value == value) {
            found = n;
            return true;
        }
    })
    return found;
}

function readInput() {
    var bodyNames = [];
    var parsedLines = [];
    input.map(line => {
        var tmp = line.split(')');
        parsedLines.push({centralBody: tmp[0], orbitingBody: tmp[1], processed: false});
    })
    while(parsedLines.filter(line => line.processed).length < input.length) {
        parsedLines.filter(line => !line.processed).map(line => {
            var centralBodyNode = getNodeByValue(line.centralBody);
            if (centralBodyNode) {
                addNode(line.orbitingBody, centralBodyNode);
                line.processed = true;
            }
        })
    }
}

function nodePath(value) {
    var n = getNodeByValue(value);
    var path = [];
    while(n.parentId) {
        n = nodes[n.parentId];
        path.push(n.value);
    }
    return path;
}

function part1() {
    var count = 0;
    nodes.filter(n => n.value != 'COM').map(n => {
        var m = n;
        while(m.parentId != undefined) {
            count++;
            m = nodes[m.parentId];
        }
    })
    console.log('total orbits', count);
}

function part2() {
    // paths
    var path1 = nodePath('YOU');
    var path2 = nodePath('SAN');

    // common body
    var firstCommonBodyName = '';
    path1.some(name => {
        if (path2.includes(name)) {
            firstCommonBodyName = name;
            return true;
        }
    })
    console.log('total orbital changes for xfer between YOU and SAN needed', path1.indexOf(firstCommonBodyName)+path2.indexOf(firstCommonBodyName));
}

addNode('COM');
readInput();

//part1();
part2();