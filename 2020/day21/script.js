let foods = [], allergens = {}, ingredients = new Map(), knownAllergenIngredients = [];

const init = input => {
    input.map(line => foods.push({
        ingredients: line.split(' contains ')[0].split(' '),
        allergens: line.split(' contains ')[1].split(', ')
    }))

    foods.map((food, foodId) => food.allergens.map(allergen => {
        if (!allergens[allergen]) allergens[allergen] = {foods: [], resolved: false, value: ''};
        allergens[allergen].foods.push(foodId);
    }))

    foods.map(food => food.ingredients.map(i => ingredients.set(i, i)))
}

const findMatchingIngredients = (foodIds, res = []) => {
    foodIds.map(f1id => getAvailableIngredients(foods[f1id].ingredients).forEach(ing1 => {
        if (res.includes(ing1)) return true;
        if (foodIds.filter(f2id => f2id != f1id && !foods[f2id].ingredients.includes(ing1)).length == 0) res.push(ing1);
    }))
    return res;
}

const resolvedAllergens = () => Object.entries(allergens).filter(([name, o]) => o.resolved === true);
const unresolvedAllergens = () => Object.entries(allergens).filter(([name, o]) => o.resolved !== true);
const getAvailableIngredients = ings => ings.filter(i => resolvedAllergens().filter(([name, o]) => o.value == i).length == 0)

init(input);

while (unresolvedAllergens().length > 0) unresolvedAllergens().forEach(([name, o]) => {
    let found = findMatchingIngredients(o.foods);
    if (found.length != 1) return true;
    o.resolved = true;
    o.value = found[0];
    knownAllergenIngredients.push(found[0]);
})

console.log('part 1', foods.reduce((a, food) => a + food.ingredients.filter(i => !knownAllergenIngredients.includes(i)).length, 0));
console.log('part 2', Object.keys(allergens).sort().map(k => allergens[k].value).join(','));
