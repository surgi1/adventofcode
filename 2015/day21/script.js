let boss = {
    hp: 103,
    dmg: 9,
    armor: 2
}

let avatarBasic = {
    hp: 100,
    dmg: 0,
    armor: 0
}

let shop = {
    weapons: [
        {name: 'Dagger', cost: 8, dmg: 4, armor: 0},
        {name: 'Shortsword', cost: 10, dmg: 5, armor: 0}, 
        {name: 'Warhammer', cost: 25, dmg: 6, armor: 0},
        {name: 'Longsword', cost: 40, dmg: 7, armor: 0}, //
        {name: 'Greataxe', cost: 74, dmg: 8, armor: 0}
    ],
    armors: [
        {name: 'Leather', cost: 13, dmg: 0, armor: 1},
        {name: 'Chainmail', cost: 31, dmg: 0, armor: 2},
        {name: 'Splintmail', cost: 53, dmg: 0, armor: 3},
        {name: 'Bandedmail', cost: 75, dmg: 0, armor: 4},
        {name: 'Platemail', cost: 102, dmg: 0, armor: 5}
    ],
    rings: [
        {name: 'Damage +1', cost: 25, dmg: 1, armor: 0}, //
        {name: 'Damage +2', cost: 50, dmg: 2, armor: 0}, 
        {name: 'Damage +3', cost: 100, dmg: 3, armor: 0},
        {name: 'Defense +1', cost: 20, dmg: 0, armor: 1},
        {name: 'Defense +2', cost: 40, dmg: 0, armor: 2},
        {name: 'Defense +3', cost: 80, dmg: 0, armor: 3},
    ]
}

// returns true if avatar wins, false otherwise
const battleWon = (avatar) => {
    let bossesDmg = boss.dmg-avatar.armor;
    if (bossesDmg < 1) bossesDmg = 1;
    let bossATW = Math.ceil(avatar.hp/bossesDmg);
    let avatarsDmg = avatar.dmg-boss.armor;
    if (avatarsDmg < 1) avatarsDmg = 1;
    let avatarATW = Math.ceil(boss.hp/avatarsDmg);
    return avatarATW <= bossATW; // avatar attacks first
}

// applies equipment and returns battler result
const battle = (equipment) => {
    // add equipment stats to avatar's clone
    let avatar = $.extend(true, {}, avatarBasic);
    equipment.map(item => {
        avatar.dmg += item.dmg;
        avatar.armor += item.armor;
    })
    return battleWon(avatar);
}

const equipmentCost = (equipment) => {
    let sum = 0;
    equipment.map(item => sum += item.cost);
    return sum;
}

let minimalCost = 1000000;
let maximalCost = 0;

for (let weaponId = 0; weaponId < shop.weapons.length; weaponId++) {
    for (let armorId = 0; armorId <= shop.armors.length; armorId++) {
        for (let ring1Id = 0; ring1Id <= shop.rings.length; ring1Id++) {
            for (let ring2Id = ring1Id; ring2Id <= shop.rings.length; ring2Id++) {
                if (ring1Id == ring2Id) continue; // no equipping the same ring twice
                let equipment = [];
                equipment.push(shop.weapons[weaponId]);
                if (armorId < shop.armors.length) equipment.push(shop.armors[armorId]);
                if (ring1Id < shop.rings.length) equipment.push(shop.rings[ring1Id]);
                if (ring2Id < shop.rings.length) equipment.push(shop.rings[ring2Id]);
                if (battle(equipment)) {
                    let cost = equipmentCost(equipment);
                    if (cost < minimalCost) {
                        console.log('new minimal cost found', cost, 'gold', equipment); // p1
                        minimalCost = cost;
                    }
                }
                if (!battle(equipment)) {
                    let cost = equipmentCost(equipment);
                    if (cost > maximalCost) {
                        console.log('new maximal cost found', cost, 'gold', equipment); // p2
                        maximalCost = cost;
                    }
                }
            }
        }
    }
}
