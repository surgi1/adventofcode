let components = [];

input.map(cmp => components.push(cmp.split('/').map(n => parseInt(n))))

let paths = [];

components.map((cmp, id) => {
    if (cmp.includes(0)) {
        paths.push({
            usedConnectorIds: [id],
            openEnd: cmp[0] == 0 ? cmp[1] : cmp[1]
        })
    }
})

let progressed = true;

while (progressed) {
    progressed = false;
    let len = paths.length;
    
    for (let pathId = 0; pathId < len; pathId++) {
        let path = paths[pathId];
        if (path.finished) continue;

        let suitableNextComponentIds = [];
        for (let cmpId = 0; cmpId < components.length; cmpId++) {
            if (path.usedConnectorIds.includes(cmpId)) continue;
            let cmp = components[cmpId];
            if (cmp.includes(path.openEnd)) suitableNextComponentIds.push(cmpId);
        }

        if (suitableNextComponentIds.length > 0) {
            progressed = true;
            for (let cmpId = 0; cmpId < suitableNextComponentIds.length; cmpId++) {
                let newPath = {...path, usedConnectorIds: path.usedConnectorIds.slice()}
                let cmp = components[suitableNextComponentIds[cmpId]];
                newPath.usedConnectorIds.push(suitableNextComponentIds[cmpId]);
                newPath.openEnd = cmp[0] == newPath.openEnd ? cmp[1] : cmp[0];
                paths.push(newPath);
            }
        }
        path.finished = true;
    }

}

paths.map(path => {
    let value = 0;
    path.usedConnectorIds.map(cmpId => {
        value += components[cmpId][0]+components[cmpId][1];
    })
    path.value = value;
})

console.log('strongest bridge strength', paths.sort((a, b) => b.value-a.value)[0].value);
console.log('longest bridge strength', paths.sort((a, b) => {
    if (b.usedConnectorIds.length == a.usedConnectorIds.length) {
        return b.value-a.value;
    } else {
        return b.usedConnectorIds.length-a.usedConnectorIds.length;
    }
})[0].value);