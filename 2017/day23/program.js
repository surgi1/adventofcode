// Part 2 of the puzzle.
// So the code counts all non-prime numbers between 2 high numbers with a iteration step of 17 (this may differ for your input)
// Should you aim to solve the puzzle, I suggest you determine those 2 high numbers and a Step from the asm code

/*
// my input:
set b 67
set c b
jnz a 2
jnz 1 5
mul b 100
sub b -100000
set c b
sub c -17000  | <-- at here the 2 high numbers are fully determined
set f 1  | main while loop start
set d 2
set e 2  | middle while loop start
set g d  | inner while loop start
mul g e
sub g b
jnz g 2
set f 0
sub e -1
set g e
sub g b
jnz g -8 | inner while loop end
sub d -1
set g d
sub g b
jnz g -13 | middle while loop end
jnz f 2
sub h -1
set g b
sub g c
jnz g 2
jnz 1 3
sub b -17 | <-- this is the step
jnz 1 -23 | main while loop end
*/

// rewrote the puzzle input to javascript to spot the purpose
// added a modulo line to get rid of the inner while and a final speed-up
const main = () => {
    let b=0,c=0,d=0,e=0,f=0,h=0;

    b = 106700; //67*100 + 100000; 
    c = 123700; //b+17000;
    while (true) { // this loop gets executed 1000 times ((c-b)/17)
        console.log('finding whether', b, 'is prime.. non-primes so far', h);
        f = 1;
        d = 2;
        while (true) {
            /*e = 2;
            while (true) {
                if (d*e == b) f = 0;
                e++;
                if (e == b) break;
                if (f == 0) break;      // modification to speed-up the execution
            }*/
            if (b % d == 0) f = 0;  // modification to get rid of the inner while loop
            d++;
            if (d == b) break;
            if (f == 0) break;      // modification to speed-up the execution
        }
        if (f == 0) h++;
        if (b == c) break;
        b = b+17;
    }

    console.log(h);
}

main();

// code below this line is to verify the answer
const isPrime = num => {
    for (let i = 2, s = Math.sqrt(num); i <= s; i++) if (num % i === 0) return false; 
    return num > 1;
}

const primeTest = (from, to, step) => {
    let nonprimes = 0;
    for (let num = from; num <= to; num += step) {
        if (!isPrime(num)) nonprimes++;
    }
    console.log(nonprimes);
}

//primeTest(106700, 123700, 17);
