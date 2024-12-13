// warning, hacky approaches ahead
// p1   - rather slow; could be made much faster using factorization
//      - employs some combinatorics but also a ballpark guestimate
// p2   - who needs solutions when one can have simulation
//      - sub-par approach as doesn't employ any combinatorics

let input = 36000000;

const getDivisors = n => {
    let divisors = [];
    let mod = n;
    while (mod > 0) {
        if(n % mod == 0) divisors.push(mod);
        mod--;
    }
    return divisors;
}

const part1 = () => {
    let sum = 0, target = input/10, houseNr = 800000; // input/presents_per_elf, initial houseNr was picked after some tooling around

    while (sum < target) {
        houseNr++;
        let sum = getDivisors(houseNr).reduce((a,b) => a+b, 0);
        if (houseNr % 10000 == 0) console.log('processing houseNr', houseNr, sum);
        if (houseNr % 100000 == 0) {
            console.log('hand break'); break;
        }
    }

    console.log('houseNr', houseNr, sum);
}

//part1();

const part2 = () => {
    let houses = [];
    let i = 1;
    let maxFound = 0, houseNrFound = 0;
    let found = false;

    // ffwd to 2500000, this is the best that browser seemed to take
    while (i < 2500000) {
        for (let n = 1; n <= 50; n++) {
            let houseNr = n*i;
            if (!houses[houseNr]) houses[houseNr] = 0;
            houses[houseNr] += i*11;
        }
        i++;
    }

    maxFound = 0; houseNrFound = 0;
    for (let h = 1; h < houses.length; h++) {
        if (maxFound < input) {
            if (houses[h] > maxFound) {
                maxFound = houses[h];
                houseNrFound = h;
            }
        }
    }

    console.log(maxFound, houseNrFound);
}

part2();