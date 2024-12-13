let foods, allergens = {}, knownAllergenIngredients = [];

const findMatchingIngredients = (foodIds, res = []) => {
    foodIds.map(f1id => getAvailableIngredients(foods[f1id]).forEach(i => {
        if (res.includes(i)) return true;
        if (foodIds.filter(f2id => f2id != f1id && !foods[f2id].includes(i)).length == 0) res.push(i);
    }))
    return res;
}

const resolved = () => Object.values(allergens).filter(o => o.resolved)
const unresolved = () => Object.values(allergens).filter(o => !o.resolved)
const getAvailableIngredients = ings => ings.filter(i => resolved().filter(o => o.value == i).length == 0)

foods = input.map(l => l.split(' contains ')[0].split(' '));

input.map((l, fId) => l.split(' contains ')[1].split(', ').map(a => {
    if (!allergens[a]) allergens[a] = {foods: [], resolved: false, value: ''};
    allergens[a].foods.push(fId);
}))

while (unresolved().length > 0) unresolved().forEach(o => {
    let found = findMatchingIngredients(o.foods);
    if (found.length != 1) return true;
    o.resolved = true;
    o.value = found[0];
    knownAllergenIngredients.push(found[0]);
})

console.log('part 1', foods.reduce((a, f) => a + f.filter(i => !knownAllergenIngredients.includes(i)).length, 0));
console.log('part 2', Object.keys(allergens).sort().map(k => allergens[k].value).join(','));
