const solver = new Worker('./worker.js');

solver.onmessage = e => {
    console.log('Solution', e.data);
}

solver.postMessage(input);

let inputArr = input.split("\n");
inputArr.splice(3, 0,'  #D#C#B#A#  ','  #D#B#A#C#  ');

solver.postMessage(inputArr.join("\n"));
