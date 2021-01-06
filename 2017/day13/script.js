let layers = [], delay = 0;

const readInput = () => {
    input.map(line => {
        let arr = line.split(': ');
        layers[parseInt(arr[0])] = parseInt(arr[1]);
    })
}

const countSeverity = (delay = 0) => {
    let severity = 0;
    layers.map((depth, range) => {
        if ((range+delay) % (2*depth-2) == 0) {
            severity += depth*range + (delay != 0 ? 1 : 0); // p2
        }
    })
    return severity;
}

readInput();
console.log('part 1', countSeverity());

while (true) {
    if (countSeverity(delay) == 0) {
        console.log('part 2', delay);
        break;
    }
    delay++;
}
