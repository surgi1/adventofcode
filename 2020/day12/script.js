var start = {x:0,y:0}
var ship = {
    x:start.x,y:start.y,r:0
}
var waypoint = {
    x: 10, y: -1
}

// [x*cos - y*sin, x*sin + y*cos]
function rotate(p, a) {
    var sin = Math.round(Math.sin(a*(Math.PI/180)));
    var cos = Math.round(Math.cos(a*(Math.PI/180)));
    return {
        x: p.x*cos-p.y*sin,
        y: p.x*sin+p.y*cos
    }
}

function advanceShip(step) {
    // parse step
    var action = step[0];
    var value = parseInt(step.substr(1));

    switch (action) {
        case 'N': waypoint.y = waypoint.y-value; break;
        case 'S': waypoint.y = waypoint.y+value; break;
        case 'E': waypoint.x = waypoint.x+value; break;
        case 'W': waypoint.x = waypoint.x-value; break;
        case 'L': waypoint = rotate(waypoint, 360-value); break;
        case 'R': waypoint = rotate(waypoint, value); break;
        case 'F': 
            //ship.x = ship.x + value*(Math.round(Math.cos(ship.r*(Math.PI/180)))); // p1
            //ship.y = ship.y - value*(Math.round(Math.sin(ship.r*(Math.PI/180)))); // p1
            ship.x = ship.x + value*waypoint.x;
            ship.y = ship.y + value*waypoint.y;
            break;
    }
}

function dist(a,b) {
    return Math.abs(a.x-b.x)+Math.abs(a.y-b.y);
}

input.map(step => advanceShip(step));

console.log('ship', ship, 'dist from start', dist(ship, start));
