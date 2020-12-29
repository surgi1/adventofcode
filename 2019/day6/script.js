let nodes = [];

const addNode = (value, parentNode) => {
    nodes.push({
        id: nodes.length,
        value: value,
        parentId: parentNode?.id
    })
}

const getNodeByValue = value => {
    let found = false;
    nodes.some(n => {
        if (n.value == value) {
            found = n;
            return true;
        }
    })
    return found;
}

const readInput = () => {
    let bodyNames = [];
    let parsedLines = [];
    input.map(line => {
        let tmp = line.split(')');
        parsedLines.push({centralBody: tmp[0], orbitingBody: tmp[1], processed: false});
    })
    while(parsedLines.filter(line => line.processed).length < input.length) {
        parsedLines.filter(line => !line.processed).map(line => {
            let centralBodyNode = getNodeByValue(line.centralBody);
            if (centralBodyNode) {
                addNode(line.orbitingBody, centralBodyNode);
                line.processed = true;
            }
        })
    }
}

const nodePath = value => {
    let n = getNodeByValue(value);
    let path = [];
    while(n.parentId) {
        n = nodes[n.parentId];
        path.push(n.value);
    }
    return path;
}

const part1 = () => {
    let count = 0;
    nodes.filter(n => n.value != 'COM').map(n => {
        let m = n;
        while(m.parentId != undefined) {
            count++;
            m = nodes[m.parentId];
        }
    })
    console.log('total orbits', count);
}

const part2 = () => {
    // paths
    let path1 = nodePath('YOU');
    let path2 = nodePath('SAN');

    // common body
    let firstCommonBodyName = '';
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