let boss = {
    hp: 103,
    dmg: 9,
    armor: 2
}, avatarBasic = {
    hp: 100,
    dmg: 0,
    armor: 0
}, shop = {
    w: [
        {name: 'Dagger', cost: 8, dmg: 4, armor: 0},
        {name: 'Shortsword', cost: 10, dmg: 5, armor: 0}, 
        {name: 'Warhammer', cost: 25, dmg: 6, armor: 0},
        {name: 'Longsword', cost: 40, dmg: 7, armor: 0},
        {name: 'Greataxe', cost: 74, dmg: 8, armor: 0}
    ],
    a: [
        {name: 'Leather', cost: 13, dmg: 0, armor: 1},
        {name: 'Chainmail', cost: 31, dmg: 0, armor: 2},
        {name: 'Splintmail', cost: 53, dmg: 0, armor: 3},
        {name: 'Bandedmail', cost: 75, dmg: 0, armor: 4},
        {name: 'Platemail', cost: 102, dmg: 0, armor: 5},
        {name: 'none', cost: 0, dmg: 0, armor: 0}
    ],
    r: [
        {name: 'Damage +1', cost: 25, dmg: 1, armor: 0},
        {name: 'Damage +2', cost: 50, dmg: 2, armor: 0}, 
        {name: 'Damage +3', cost: 100, dmg: 3, armor: 0},
        {name: 'Defense +1', cost: 20, dmg: 0, armor: 1},
        {name: 'Defense +2', cost: 40, dmg: 0, armor: 2},
        {name: 'Defense +3', cost: 80, dmg: 0, armor: 3},
        {name: 'none1', cost: 0, dmg: 0, armor: 0},
        {name: 'none2', cost: 0, dmg: 0, armor: 0}
    ]
}

// returns true if avatar wins, false otherwise
const battleWon = avatar => {
    let bDmg = Math.max(boss.dmg-avatar.armor, 1), aDmg = Math.max(avatar.dmg-boss.armor, 1);
    let bATW = Math.ceil(avatar.hp/bDmg), aATW = Math.ceil(boss.hp/aDmg);
    return aATW <= bATW; // avatar attacks first
}

// applies equipment and returns battler result
const battle = equipment => {
    let avatar = {...avatarBasic};
    equipment.map(item => {
        avatar.dmg += item.dmg;
        avatar.armor += item.armor;
    })
    return battleWon(avatar);
}

const run = e => {
    let cost = e.reduce((a, item) => a+item.cost, 0);
    if (battle(e)) {
        if (!minCost) minCost = cost;
        minCost = Math.min(cost, minCost)
    } else {
        if (!maxCost) maxCost = cost;
        maxCost = Math.max(cost, maxCost)
    }
}

let minCost = false, maxCost = false;

shop.w.map(w => shop.a.map(a => shop.r.map((r1, r1Id) => shop.r.filter((r2, r2Id) => r2Id > r1Id).map(r2 => run([w, a, r1, r2])))))

console.log('minCost', minCost);
console.log('maxCost', maxCost);
