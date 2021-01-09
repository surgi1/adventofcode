let foods = [], allergens = {}, ingredients = [], knownAllergenIngredients = [];

const init = input => {
    input.map(line => {
        let arr = line.split(' contains ');
        foods.push({
            ingredients: arr[0].split(' '),
            allergens: arr[1].split(', ')
        })
    })

    foods.map((food, foodId) => {
        food.allergens.map(allergen => {
            if (!allergens[allergen]) allergens[allergen] = {foods: [], resolved: false, value: ''};
            allergens[allergen].foods.push(foodId);
        })
    })

    foods.map((food, foodId) => {
        food.ingredients.map(ing => {
            if (!ingredients.includes(ing)) ingredients.push(ing);
        })
    })
}

const getAvailableIngredients = ings => ings.filter(ing => {
    if (resolvedAllergens().filter(([name, o]) => o.value == ing).length == 0) return true;
})

const findMatchingIngredients = foodIds => {
    let foundIngredients = [];
    foodIds.map(f1id => {
        getAvailableIngredients(foods[f1id].ingredients).map(ing1 => {
            let ingMatch = true;
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

const unresolvedAllergens = () => Object.entries(allergens).filter(([name, o]) => o.resolved !== true);
const resolvedAllergens = () => Object.entries(allergens).filter(([name, o]) => o.resolved === true);

init(input);

while (unresolvedAllergens().length > 0) {
    unresolvedAllergens().map(([name, o]) => {
        let found = findMatchingIngredients(o.foods);
        if (found.length == 1) {
            o.resolved = true;
            o.value = found[0];
            knownAllergenIngredients.push(found[0]);
        }
    })
}

let part1Count = 0;
foods.map(food => part1Count += food.ingredients.filter(ing => !knownAllergenIngredients.includes(ing)).length);

let part2Answer = [];
Object.keys(allergens).sort().map(k => part2Answer.push(allergens[k].value));

console.log('part 1', part1Count);
console.log('part 2', part2Answer.join(','));
