// for magic numbers explanation see comments in input.js

function recipeValue(a,b,c,d) {
    return (4*a-c)*(-2*a+5*b)*(-b+5*c-2*d)*2*d;
}

function calories(a,b,c,d) {
    return 5*a+8*b+6*c+d;
}

var foundMax = 0;
for (var a = 1; a <= 100; a++) {
    for (var b = 1; b <= 100; b++) {
        for (var c = 1; c <= 100; c++) {
            if (a+b+c > 99) continue;
            var d = 100-a-b-c;
            if (4*a-c <= 0) continue;
            if (-2*a+5*b <= 0) continue;
            if (-b+5*c-2*d <= 0) continue;
            if (calories(a,b,c,d) > 500) continue;
            foundMax = Math.max(foundMax, recipeValue(a,b,c,d));
        }
    }
}

console.log(foundMax);