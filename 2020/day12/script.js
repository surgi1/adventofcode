const dist = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

const part1 = input => {
    const advanceShip = step => {
        let action = step[0], value = parseInt(step.substr(1));
        switch (action) {
            case 'N': ship.y -= value; break;
            case 'S': ship.y += value; break;
            case 'E': ship.x += value; break;
            case 'W': ship.x -= value; break;
            case 'L': ship.r += value; break;
            case 'R': ship.r -= value; break;
            case 'F':
                ship.x += value*(Math.round(Math.cos(ship.r*(Math.PI/180))));
                ship.y -= value*(Math.round(Math.sin(ship.r*(Math.PI/180))));
                break;
        }
    }

    let ship = {x:0,y:0,r:0}
    input.map(step => advanceShip(step));
    return dist(ship, {x:0,y:0});
}

const part2 = input => {
    const rotate = (p, a) => {
        let sin = Math.sin(a*(Math.PI/180)),
            cos = Math.cos(a*(Math.PI/180));
        return {
            x: Math.round(p.x*cos-p.y*sin),
            y: Math.round(p.x*sin+p.y*cos)
        }
    }

    const advanceShip = step => {
        let action = step[0], value = parseInt(step.substr(1));
        switch (action) {
            case 'N': waypoint.y -= value; break;
            case 'S': waypoint.y += value; break;
            case 'E': waypoint.x += value; break;
            case 'W': waypoint.x -= value; break;
            case 'L': waypoint = rotate(waypoint, 360-value); break;
            case 'R': waypoint = rotate(waypoint, value); break;
            case 'F': 
                ship.x += value*waypoint.x;
                ship.y += value*waypoint.y;
                break;
        }
    }

    let ship = {x:0,y:0}, waypoint = {x: 10, y: -1}
    input.map(step => advanceShip(step));
    return dist(ship, {x:0,y:0});
}

console.log('part 1', part1(input));
console.log('part 2', part2(input));