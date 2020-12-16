// warning, hacky approaches ahead
// p1   - rather slow; could be made much faster using factorization
//      - employs some combinatorics but also a ballpark guestimate
// p2   - who needs solutions when one can have simulation
//      - sub-par approach as doesn't employ any combinatorics

var input = 36000000;

function getDivisors(n){
    var divisors = [];
    var mod = n;
    while (mod > 0) {
        if(n % mod == 0) divisors.push(mod);
        mod--;
    }
    return divisors;
}

function part1() {
    var sum = 0, target = input/10, houseNr = 800000; // input/presents_per_elf, initial houseNr was picked after some tooling around

    while (sum < target) {
        houseNr++;
        var sum = getDivisors(houseNr).reduce((a,b) => a+b, 0);
        if (houseNr % 10000 == 0) console.log('processing houseNr', houseNr, sum);
        if (houseNr % 100000 == 0) {
            console.log('hand break'); break;
        }
    }

    console.log('houseNr', houseNr, sum);
}

//part1();

function part2() {
    var houses = [];
    var i = 1;
    var maxFound = 0, houseNrFound = 0;
    var found = false;

    // ffwd to 2500000, this is the best that browser seemed to take
    while (i < 2500000) {
        for (var n = 1; n <= 50; n++) {
            var houseNr = n*i;
            if (!houses[houseNr]) houses[houseNr] = 0;
            houses[houseNr] += i*11;
        }
        i++;
    }

    maxFound = 0; houseNrFound = 0;
    for (var h = 1; h < houses.length; h++) {
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