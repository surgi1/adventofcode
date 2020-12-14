var input = [
'bori 3 65536 2',       //  i6   r2 = r3 OR 65536 = 0 OR 65536
'seti 10736359 9 3',    //  i7   r3 = 10736359
'bani 2 255 1',         //  i8   r1 = r2 & 255 = 65536 & 255 = 0
'addr 3 1 3',           //  i9   r3 = r3+r1 = 10736359
'bani 3 16777215 3',    // i10   r3 = r3 & 16777215 = 10736359
'muli 3 65899 3',       // i11   r3 = r3*65899 = 707515321741
'bani 3 16777215 3',    // i12   r3 = r3 & 16777215 = 3345805
'gtir 256 2 1',         // i13   if 256 > r2 r1 = 1 else r1 = 0 |  if 256 > 65536 r1 = 1 else r1 = 0 => r1 = 0
'addr 1 4 4',           // i14   skok na r1+14+1 | skok na 15 (skocilo by na 16 kdyby ^ byla true)
'addi 4 1 4',           // i15   skok na 17
'seti 27 2 4',          // i16   skok na 28 (v prvni iteraci se neprovede)
'seti 0 3 1',           // i17   r1 = 0 // nastaveni iteratoru, nasledna smycka se provede 256-krat
'addi 1 1 5',           // i18   r5 = r1+1=1
                        //      ------------------------------ vnitrni iterator
'muli 5 256 5',         // i19   r5 = r5*256 = 256
'gtrr 5 2 5',           // i20   if r5 > r2 r5 = 1 else r5 = 0 | if 256 > 65536 | r5 = 0
'addr 5 4 4',           // i21   skok na i22 pokud ^ false, skok na i23 pokud ^ true
'addi 4 1 4',           // i22   skok na i24
'seti 25 8 4',          // i23   skok na i26 // vyskoceni ze smycky
'addi 1 1 1',           // i24   r1 = r1+1 = 1
'seti 17 6 4',          // i25   skok na i18 // skok na zacatek iteracni smycky
                        //      ------------------------------ /vnitrni iterator
'setr 1 5 2',           // i26   r2 = r1 | r2 = 256
'seti 7 7 4',           // i27   skok na i8
'eqrr 3 0 1',           // i28   if r3 == r0 r1 = 1;END; else r1 = 0;skok na i6
                        //      ------------------------------ nize je omacka
'addr 1 4 4',           // i29   pokud r1 > 0 END
'seti 5 1 4']           // i30   skok na i6 // main while loop

var r0 = 0, r1 = 0, r2 = 0, r3 = 0, r4 = 0, r5 = 0;
//r0 = 16311888;
//r0 = 11813057;
//r0 = 3345805;
//r0 = 149;
//r0 = 12299420;

var do67 = true;

var latestStoppingR3 = 0, timerHandle;

var ticks = 0;

function run1() {
    while ((r3 != r0) || (ticks == 0)) {

        if (do67) r2 = r3 | 65536; // i6
        if (do67) r3 = 10736359;
        
        if (!do67) do67 = true;
        
        r1 = r2 & 255; // i8
        r3 = r3 + r1; // i9
        r3 = r3 & 16777215; // i10
        r3 = r3 * 65899; // i11
        r3 = r3 & 16777215; // i12
        
        if (r2 >= 256) {
            r1 = 0;while (r2 >= (r1+1)*256) r1++;r2 = r1;
            do67 = false;
        }

        if (do67) {
            latestStoppingR3 = r3;
            //console.log(latestStoppingR3);
        }

        ticks++;
        if (ticks % 100000 == 0) {
            console.log('handbreaked');
            break;
        }
    }
    console.log('ticks', ticks, 'latest stopping crit', latestStoppingR3, 'regs', r0, r1, r2, r3, r4, r5);
    //timerHandle = setTimeout(() => run1(), 5000);
}

function advanceR3() {
    r3 = r3 + (r2 & 255); // i9
    r3 = r3 & 16777215; // i10 16777215 = 2^24-1
    r3 = r3 * 65899; // i11
    r3 = r3 & 16777215; // i12
}

var distinctR3s = [];

// mk 2
function run2() {
    while ((r3 != r0) || (ticks == 0)) {

        r2 = r3 | 65536; // i6
        r3 = 10736359;

        while (r2 >= 256) {
            advanceR3();
            r2 = r2 >> 8;
            // r1 = 0;while (r2 >= (r1+1)*256) r1++;r2 = r1; // hihi
        }
        advanceR3();

        latestStoppingR3 = r3;
        if (!distinctR3s.includes(latestStoppingR3)) distinctR3s.push(latestStoppingR3);
        //console.log(latestStoppingR3);

        ticks++;
        if (ticks % 1000000 == 0) {
            console.log('handbreaked');
            break;
        }
    }
    console.log('gticks', ticks/1000000000, ' latest stopping crit', latestStoppingR3, 'regs', r0, r1, r2, r3, r4, r5);
    console.log(distinctR3s.length);
    timerHandle = setTimeout(() => run2(), 5000);
}

run2();

// pro jake r3 plati, ze r3 | 65536 < 256 ?

// p2 answers: 10736359 too high
//             12299420 too high
//             1413889 // correct!!