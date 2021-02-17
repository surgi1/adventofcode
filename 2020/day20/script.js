const rotate = (src, out = Array.from(src)) => out.map((r,y) => r.map((p,x) => src[x][src.length-1-y]))

const processImage = (img, monsterCount = 0) => {
    const monster = ['00000000000000000040','20000320000320000356','02003002003002003000'].map(l => l.split(''))
    const isMonsterAt = (sx, sy) => monster.every((l,y) => l.every((c,x) => c == '0' || c*img[sy+y][sx+x] > 0));
    const markMonsterAt = (sx, sy) => monster.map((l,y) => l.map((c,x) => img[sy+y][sx+x] = c != '0' ? c*1.0+(monsterCount*100) : img[sy+y][sx+x]))
    const monsters = () => img.reduce((a,l,y) => a+l.filter((c,x) => img[y+2] && l[x+20] && isMonsterAt(x,y) && markMonsterAt(x,y) && monsterCount++).length, 0)
    const animateWaves = (waves = document.querySelectorAll('.t1')) => waves.forEach(w => Math.random() < 0.4 && w.classList.toggle('hidden'))
    const genHtml = () => img.reduce((s,l,y) => s+l.reduce((s2,p,x) => s2 += p == 0 ? '' :
        `<div class="p t${p % 100} m${Math.floor(p/100)}" style="left:${x*12}px;top:${y*12}px"></div>`, ''), '')
    const animateMonster = (m, parts = document.querySelectorAll('.m'+m)) => {
        if (parts.length > 0) parts.forEach(p => p.classList.add('animated'));
        if (m < monsterCount) setTimeout(() => animateMonster(m+1), parts.length > 0 ? 200 : 0);
    }

    for (let i = 0; i < 3; i++) if (!monsters()) img = rotate(img);
    if (!monsters()) img.reverse(); // flip
    while (!monsters()) img = rotate(img);
    document.getElementById('root').innerHTML = genHtml();
    animateMonster(1);
    setInterval(animateWaves, 1000);
    return img.reduce((a,l) => a+l.filter(e => e == '1').length, 0);
}

console.log('water roughness', processImage(new TileSet(input).process()));