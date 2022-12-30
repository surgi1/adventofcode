const solver = new Worker('./worker.js');

solver.onmessage = e => {
    console.log('Solutions', e.data, e);
}

solver.postMessage(input);
