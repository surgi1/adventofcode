var r0 = 0, r1 = 0, r2 = 0, r3 = 0, r4 = 0, r5 = 0;
var latestStoppingR3 = 0, timerHandle;
var ticks = 0;

function advanceR3() {
    r3 = r3 + (r2 & 255); // i9
    r3 = r3 & 16777215; // i10 16777215 = 2^24-1
    r3 = r3 * 65899; // i11
    r3 = r3 & 16777215; // i12
}

var distinctR3s = [];

// rewrite from the device assembly, mk2
function run() {
    while ((r3 != r0) || (ticks == 0)) {

        r2 = r3 | 65536; // i6
        r3 = 10736359;

        while (r2 >= 256) {
            advanceR3();
            r2 = r2 >> 8;
        }
        advanceR3();

        latestStoppingR3 = r3;
        if (!distinctR3s.includes(latestStoppingR3)) distinctR3s.push(latestStoppingR3);

        ticks++;
        if (ticks % 1000000 == 0) {
            console.log('handbreaked');
            break;
        }
    }
    console.log('gticks', ticks/1000000000, ' latest stopping crit', latestStoppingR3, 'regs', r0, r1, r2, r3, r4, r5);
    console.log(distinctR3s.length);
    timerHandle = setTimeout(() => run(), 5000);
}

run();
