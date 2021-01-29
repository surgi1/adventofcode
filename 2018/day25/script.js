const dist = (a,b) => a.reduce((acc, v, i) => acc += Math.abs(v-b[i]), 0)
const inCon = (p, con) => con.filter(id => dist(p, data[id]) <= 3).length > 0

let constellations = [], used = [];

while (used.length < data.length) {
    let startId = 0, con = [], len = 0;
    while (used.includes(startId)) startId++;
    data.map((d, i) => dist(d, data[startId]) <= 3 && con.push(i))
    while (len != con.length) {
        len = con.length;
        data.map((d, i) => !con.includes(i) && inCon(d, con) && con.push(i))
    }
    constellations.push(con);
    used.push(...con);
}

console.log(constellations.length);