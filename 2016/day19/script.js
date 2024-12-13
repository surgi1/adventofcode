const elves = 3004953;

const initList = nodesCount => {
    let list = [];
    for (let i = 0; i < nodesCount; i++) {
        list.push({
            id: i,
            text: i+1,
            rightId: (i > 0 ? i-1 : nodesCount-1),
            leftId: (i < nodesCount-1 ? i+1 : 0),
            out: false
        })
    }
    return list;
}

const removeNode = (list, id) => {
    list[id].out = true;
    let left = list[list[id].leftId];
    let right = list[list[id].rightId];
    left.rightId = right.id;
    right.leftId = left.id;
}

const part1 = elves => {
    let list = initList(elves), currentId = 0;
    while (list[currentId].leftId != currentId) {
        removeNode(list, list[currentId].leftId);
        currentId = list[currentId].leftId;
    }
    return list[currentId].text;
}

const part2 = elves => {
    let list = initList(elves), currentId = 0, circleLength = elves;
    let oppositeId = Math.floor(circleLength/2);
    while (circleLength > 1) {
        removeNode(list, oppositeId);
        currentId = list[currentId].leftId;
        if (circleLength % 2 == 1) oppositeId = list[oppositeId].leftId;
        oppositeId = list[oppositeId].leftId;
        circleLength--;
    }
    return list[currentId].text;
}

console.log(part1(elves));
console.log(part2(elves));
