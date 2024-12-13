// for magic numbers explanation see comments in input.js
const recipeValue = (a,b,c,d) => (4*a-c)*(-2*a+5*b)*(-b+5*c-2*d)*2*d;
const calories = (a,b,c,d) => 5*a+8*b+6*c+d;

const solve = (considerCalories = false) => {
    let foundMax = 0;
    for (let a = 1; a <= 100; a++) {
        for (let b = 1; b <= 100; b++) {
            for (let c = 1; c <= 100; c++) {
                if (a+b+c > 99) continue;
                let d = 100-a-b-c;
                if (4*a-c <= 0) continue;
                if (-2*a+5*b <= 0) continue;
                if (-b+5*c-2*d <= 0) continue;
                if (considerCalories && calories(a,b,c,d) > 500) continue;
                foundMax = Math.max(foundMax, recipeValue(a,b,c,d));
            }
        }
    }
    return foundMax;
}

console.log('part 1', solve());
console.log('part 2', solve(true));