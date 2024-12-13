const prefix = 'udskfozm', start = {x: 0, y: 0}, end = {x: 3, y: 3};
const directions = {U: {x: 0, y: -1}, D: {x: 0, y: 1}, L: {x: -1, y: 0}, R: {x: 1, y: 0}};

const directionPossible = (dir, p) => {
    if (dir == 'U') return p.y > 0;
    if (dir == 'D') return p.y < 3;
    if (dir == 'L') return p.x > 0;
    if (dir == 'R') return p.x < 3;
}

const getOpenDoors = (path, p) => {
    let hash = CryptoJS.MD5(prefix+path).toString();
    let openDoors = [];
    Object.keys(directions).map((dir, id) => {
        if (['b','c','d','e','f'].includes(hash[id]) && directionPossible(dir, p)) openDoors.push(dir);
    })
    return openDoors;
}

const move = (trip, dir) => {
    trip.pos.x += directions[dir].x;
    trip.pos.y += directions[dir].y;
    trip.path = trip.path+dir;
    trip.steps++;
}

let trips = [{steps: 0, pos: {...start}, path: ''}],
    longestTripLength = 0, shortestTripLength = 1000;

while (trips.filter(t => t.finished !== true).length > 0) {
    let len = trips.length;
    for (var i = 0; i < len; i++) {
        let trip = trips[i];
        if (trip.finished) continue;
        if (trip.pos.x == end.x && trip.pos.y == end.y) {
            trip.finished = true;
            trip.reachedEnd = true;
            if (longestTripLength < trip.steps) {
                longestTripLength = trip.steps;
                console.log('new longest trip length', longestTripLength);
            }
            if (shortestTripLength > trip.steps) {
                shortestTripLength = trip.steps;
                console.log('new shortest trip', shortestTripLength, trip.path);
            }
            continue;
        }
        getOpenDoors(trip.path, trip.pos).map(dir => {
            let newTrip = {...trip, pos: {...trip.pos}};
            move(newTrip, dir);
            trips.push(newTrip);
        })
        trip.finished = true;
    }
}
