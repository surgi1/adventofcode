let components = input.map(c => c.split('/').map(Number));

let paths = components.filter(c => c.includes(0)).map(c => Object({
    usedConnectors: [c],
    openEnd: c[0] == 0 ? c[1] : c[1]
}))

while (paths.filter(p => !p.finished).length) {
    paths.filter(p => !p.finished).forEach(path => {
        components.filter((c, cId) => !path.usedConnectors.includes(c) && c.includes(path.openEnd)).forEach(c => {
            paths.push({...path,
                usedConnectors: [...path.usedConnectors, c],
                openEnd: c[0] == path.openEnd ? c[1] : c[0]
            });
        })
        path.finished = true;
    })
}

paths.forEach(p => p.value = p.usedConnectors.reduce((a, c) => a+c[0]+c[1], 0));

console.log('strongest bridge strength', paths.sort((a, b) => b.value-a.value)[0].value);
console.log('longest bridge strength', paths.sort((a, b) => {
    if (b.usedConnectors.length == a.usedConnectors.length) return b.value-a.value;
    return b.usedConnectors.length-a.usedConnectors.length;
})[0].value);