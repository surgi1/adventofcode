class Renderer {
    constructor({resources, action}) {
        this.resources = resources;
        this.action = action;
        this.init();
        return this;
    }

    spriteSize = [84, 108];

    cellSize = [84, 84];

    spriteIds = {
        A: 6,
        B: 0, // 0 if r2d2 (1) not fit
        C: 5,
        D: 4,
        wallTop: 7,
        wall: 9,
        floor: 8,
    }

    createPlane = src => {
        let e = document.createElement('canvas');
        e.width = src.width;
        e.height = src.height;
        return e;
    }

    drawBgSprite = (ctx, spriteId, [x, y]) => ctx.drawImage(
        this.resources.sprites.data,
        spriteId * this.spriteSize[0], 0,
        this.cellSize[0], this.cellSize[1],
        x * this.cellSize[0], y * this.cellSize[1],
        this.cellSize[0], this.cellSize[1]
    );
    
    drawPodSprite = (type, highlighted, [x, y], [ax, ay] = [0, 0]) => this.ctx.drawImage(
        this.resources.sprites.data,
        (this.spriteIds[type] + (highlighted ? 10 : 0)) * this.spriteSize[0], 0,
        this.spriteSize[0], this.spriteSize[1],
        x * this.cellSize[0] + ax, y * this.cellSize[1] + ay - 24 - 20,
        this.spriteSize[0], this.spriteSize[1]
    );

    drawEmblemSprite = (type, [x, y]) => this.ctx.drawImage(
        this.resources.sprites.data,
        (this.spriteIds[type]+10) * this.spriteSize[0], 0,
        this.spriteSize[0], 48,
        x * this.cellSize[0], y * this.cellSize[1] + 14,
        this.spriteSize[0], 48
    );

    initPlanes = map => {
        this.canvas.planes = {
            bg: this.createPlane(canvas)
        };

        for (let y = 0; y < map.length; y++)
            for (let x = 0; x < map[0].length; x++) {
                let v = map[y][x],
                    target = this.canvas.planes.bg.getContext('2d'),
                    spriteId = ['#', ' ', undefined].includes(v) ? (y == 0 ? this.spriteIds.wallTop : this.spriteIds.wall) : this.spriteIds.floor;
                this.drawBgSprite(target, spriteId, [x, y]);
            }
    }

    prepareFrame = () => {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // clear
        this.ctx.drawImage(this.canvas.planes.bg, 0, 0);
    }

    setCanvasHeight = cells => {
        this.canvas.style.height = this.cellSize[1] * cells + 'px';
        this.canvas.setAttribute('height', this.cellSize[1] * cells);
    }

    rectOnPos = (p, fillStyle, alpha) => {
        this.ctx.save();
        this.ctx.globalAlpha = alpha;
        this.ctx.beginPath();
        this.ctx.fillStyle = fillStyle;
        this.ctx.rect(
            p.x*this.cellSize[0], p.y*this.cellSize[1],
            this.cellSize[0], this.cellSize[1]
        );
        this.ctx.fill();
        this.ctx.restore();
    }

    getMousePos = () => this.mousePos;

    getCursorPosition = e => {
        const rect = this.canvas.getBoundingClientRect();
        this.mousePos.x = Math.floor((e.clientX - rect.left) / this.cellSize[0]);
        this.mousePos.y = Math.floor((e.clientY - rect.top) / this.cellSize[1]);
    }

    init = () => {
        this.mousePos = {};
        this.canvas = id('canvas');
        this.ctx = canvas.getContext('2d');
        this.canvas.addEventListener('mousemove', e => this.getCursorPosition(e))
        this.canvas.addEventListener('mouseup', e => this.action.click(this.mousePos))
    }
}