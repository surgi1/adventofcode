let comp = new Computer();

//comp.load([109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99]);
//comp.load([1102,34915192,34915192,7,4,7,99,0]);

comp.load(input);

console.log(comp.run([2]));