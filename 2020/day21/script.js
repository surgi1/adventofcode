var foods = [],
    allergens = {},
    ingredients = [];

function readInput() {
    input.map(line => {
        var arr = line.split(' contains ');
        foods.push({
            ingredients: arr[0].split(' '),
            allergens: arr[1].split(', ')
        })
    })
}

function initAllergens() {
    foods.map((food, foodId) => {
        food.allergens.map(allergen => {
            if (!allergens[allergen]) allergens[allergen] = {foods: [], resolved: false, value: ''};
            allergens[allergen].foods.push(foodId);
        })
    })
}

function initIngredients() {
    foods.map((food, foodId) => {
        food.ingredients.map(ing => {
            if (!ingredients.includes(ing)) ingredients.push(ing);
        })
    })
}

function getAvailableIngredients(ings) {
    var result = [];
    ings.map(ing => {
        if (resolvedAllergens().filter(([name, o]) => o.value == ing).length == 0) result.push(ing);
    })
    return result;
}

function findMatchingIngredients(foodIds) {
    var foundIngredients = [];
    foodIds.map(f1id => {
        getAvailableIngredients(foods[f1id].ingredients).map(ing1 => {
            var ingMatch = true;
            if (!foundIngredients.includes(ing1)) {
                foodIds.filter(f2id => f2id != f1id).some(f2id => {
                    if (!foods[f2id].ingredients.includes(ing1)) {
                        ingMatch = false;
                        return true;
                    }
                })
                if (ingMatch) foundIngredients.push(ing1);
            }
        })
    })
    return foundIngredients;
}

function unresolvedAllergens() {
    return Object.entries(allergens).filter(([name, o]) => o.resolved !== true);
}

function resolvedAllergens() {
    return Object.entries(allergens).filter(([name, o]) => o.resolved === true);
}

readInput();
initAllergens();
initIngredients();

var knownAllergenIngredients = [];

while (unresolvedAllergens().length > 0) {
    unresolvedAllergens().map(([name, o]) => {
        var found = findMatchingIngredients(o.foods);
        if (found.length == 1) {
            o.resolved = true;
            o.value = found[0];
            knownAllergenIngredients.push(found[0]);
        }
    })
}

var part1Count = 0;
foods.map(food => {
    part1Count += food.ingredients.filter(ing => !knownAllergenIngredients.includes(ing)).length;
})

var part2Answer = [];
Object.keys(allergens).sort().map(k => part2Answer.push(allergens[k].value));

console.log('part 1 answer', part1Count);
console.log('part 2 answer', part2Answer.join(','));
