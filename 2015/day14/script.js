let reindeers = [];
let timeToEnd = 2503;

input.map(line => {
    let nums = line.match(/\d+/g).map(n => parseInt(n));
    let name = line.split(' ')[0];
    reindeers.push({
        name: name,
        speed: nums[0],
        moveTime: nums[1],
        restTime: nums[2],
        period: nums[1]+nums[2],
        distancePerPeriod: nums[0]*nums[1],
        distance: 0,
        score: 0
    })
})

const part1 = () => {
    reindeers.map(rdeer => {
        rdeer.distance += Math.floor(timeToEnd/rdeer.period)*rdeer.distancePerPeriod; // base distance
        let timeLeft = timeToEnd % rdeer.period;
        if (timeLeft < rdeer.moveTime) rdeer.distance += timeLeft*rdeer.speed; else rdeer.distance += rdeer.distancePerPeriod;
    })

    reindeers.sort((a,b) => {
        return b.distance-a.distance;
    })
}

const part2 = () => {
    for (let i = 0; i < timeToEnd; i++) {
        reindeers.map(rdeer => {
            let timeIn = i % rdeer.period;
            if (timeIn < rdeer.moveTime) rdeer.distance += rdeer.speed;
        })
        reindeers.sort((a,b) => {
            return b.distance-a.distance;
        }).filter(r => r.distance == reindeers[0].distance).map(r => r.score++)
    }
    reindeers.sort((a,b) => {
        return b.score-a.score;
    })
}

//part1();
part2();

console.log(reindeers);