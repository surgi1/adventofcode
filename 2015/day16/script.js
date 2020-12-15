const clues = {
    children: {value: 3, mode: 'equal'},
    cats: {value: 7, mode: 'gt'},
    samoyeds: {value: 2, mode: 'equal'},
    pomeranians: {value: 3, mode: 'lt'},
    akitas: {value: 0, mode: 'equal'},
    vizslas: {value: 0, mode: 'equal'},
    goldfish: {value: 5, mode: 'lt'},
    trees: {value: 3, mode: 'gt'},
    cars: {value: 2, mode: 'equal'},
    perfumes: {value: 1, mode: 'equal'}
}

Object.entries(input).map(([sueId, sueProps]) => {
    Object.entries(clues).map(([propName, prop]) => {
        if (sueProps[propName] !== undefined) {
            switch (prop.mode) {
                case 'equal': 
                    if (sueProps[propName] != prop.value) input[sueId].excluded = true;
                    break;
                case 'gt': 
                    if (sueProps[propName] < prop.value) input[sueId].excluded = true;
                    break;
                case 'lt': 
                    if (sueProps[propName] > prop.value) input[sueId].excluded = true;
                    break;
            }
        }
    })
})

Object.entries(input).map(([sueId, sueProps]) => {
    if (sueProps.excluded !== true) console.log(sueId, sueProps);
})