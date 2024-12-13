// visuals!

let blocks = input.split("\n").map(line => line.split('~').map(c => c.split(',').map(Number)))
                  .sort((a, b) => b[1][2] - a[1][2]);

let fallen = new Set(),
    p1 = 0, p2 = 0, processingId = -1, p1InitState = '';
let boxes = [], text1, texts = ['Move/rotate with mouse or arrows', 'Initializing.. '];

const getState = blocks => blocks.map(b => b[1][2]).join(',');

const fall = blocks => {
    blocks.forEach((b, i) => {
        if (i == processingId) return true;
        if (b[0][2] <= 1) return true;

        let z = b[0][2]-1,
            canFall = true;

        for (let x = b[0][0]; x <= b[1][0]; x++) for (let y = b[0][1]; y <= b[1][1]; y++) {
            if (blocks.some((o, j) => j !== processingId && i !== j && o[0][0] <= x && o[1][0] >= x && o[0][1] <= y && o[1][1] >= y && o[0][2] <= z && o[1][2] >= z)) {
                canFall = false;
                break;
            }
        }
        if (canFall) {
            b[1][2]--;
            b[0][2]--;
            fallen.add(i);
            boxes[i].position.y--;
        }
    })
}

const fallFull = blocks => {
    let state = '';
    while (state !== getState(blocks)) {
        state = getState(blocks);
        fall(blocks);
    }
    return state;
}

const timedFall = _blocks => {
    let s1 = getState(_blocks);
    fall(_blocks);
    if (getState(_blocks) == s1) {
        let delay = 500;

        if (processingId >= 0) {
            if (getState(_blocks) == p1InitState) { p1++; delay = 0; }
            p2 += fallen.size;
        }

        processingId++;
        if (processingId < boxes.length) {
            texts[1] = 'Initializing.. done';
            texts[2] = 'Processing block.. #' + processingId;
            texts[3] = 'Part1: ' + p1;
            texts[4] = 'Part2: ' + p2;

            setTimeout(() => {
                fallen = new Set();
                let nblocks = JSON.parse(JSON.stringify(blocks));
                //nblocks.splice(processingId, 1);
                resetBoxes();
                boxes[processingId].setEnabled(false);
                p1InitState = getState(nblocks);

                setTimeout(() => timedFall(nblocks), 5);
            }, delay);
        } else {
            texts[1] = 'Initializing.. done';
            texts[2] = 'Processing block.. done';
            texts[3] = 'Part1: ' + p1;
            texts[4] = 'Part2: ' + p2;
        }
    } else {
        setTimeout(() => timedFall(_blocks), 5);
    }
}

let scale = 1/1;

const resetBoxes = () => {
    blocks.forEach((b, i) => {
        let h = scale*(b[1][2] - b[0][2] + 1),
            w = scale*(b[1][0] - b[0][0] + 1),
            d = scale*(b[1][1] - b[0][1] + 1);

        boxes[i].position.y = h/2 + scale*b[0][2] - 70;
        boxes[i].position.x = w/2 + scale*b[0][0] - 5;
        boxes[i].position.z = d/2 + scale*b[0][1] - 5;
        boxes[i].setEnabled(true);
    })
}

const updateText = () => text1.text = texts.join('\n');

const draw = () => {
    var canvas = document.getElementById('renderCanvas')

    var sceneToRender = null
    var createDefaultEngine = function() {
        return new BABYLON.Engine(canvas, true, {
            preserveDrawingBuffer: true,
            stencil: true,
            disableWebGL2Support: false
        })
    }
    const createScene = (engine) => {
        const scene = new BABYLON.Scene(engine)

        const camera = new BABYLON.ArcRotateCamera('Camera', 3 * Math.PI / 4, Math.PI / 4, 4, BABYLON.Vector3.Zero(), scene)
        camera.attachControl()

        const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(1, 1, 0), scene,)
        const light2 = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(1, 50, 21), scene);
        const light4 = new BABYLON.DirectionalLight("DirectionalLight", new BABYLON.Vector3(0, -1, 0), scene);
        light.intensity = 0.5;

        camera.setPosition(new BABYLON.Vector3(0, 0, 100));

        blocks.forEach(b => {

            let mat = new BABYLON.StandardMaterial("texture1", scene);

            mat.diffuseColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
            
            mat.alpha = 1.0;

            let h = scale*(b[1][2] - b[0][2] + 1),
                w = scale*(b[1][0] - b[0][0] + 1),
                d = scale*(b[1][1] - b[0][1] + 1);

            let box = BABYLON.MeshBuilder.CreateBox( 'box', { height: h, width: w, depth: d, updatable: true}, scene )

            box.material = mat;
            boxes.push(box);
        })

        resetBoxes();

        // GUI
        var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

        text1 = new BABYLON.GUI.TextBlock();
        text1.fontFamily = 'Source Code Pro';
        text1.color = "white";
        text1.fontSize = 16;
        text1.paddingTop = 48;
        text1.paddingLeft = 12;
        text1.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        text1.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        advancedTexture.addControl(text1);  

        return scene

    }

    window.initFunction = async function() {

        var asyncEngineCreation = function() {
            try {
                return createDefaultEngine()
            } catch (e) {
                console.log('the available createEngine function failed. Creating the default engine instead')
                return createDefaultEngine()
            }
        }

        window.engine = asyncEngineCreation()
        if (!window.engine) throw 'engine should not be null.'
        window.scene = createScene(window.engine)
    }
    initFunction().then(() => {
        sceneToRender = scene
        engine.runRenderLoop(function() {
            if (sceneToRender && sceneToRender.activeCamera) {
                sceneToRender.render();
                updateText();
            }
        })
        timedFall(blocks);
    })

    // Resize
    window.addEventListener('resize', function() {
        engine.resize()
    })
}

draw();

const restart = () => {
    blocks = input.split("\n").map(line => line.split('~').map(c => c.split(',').map(Number)))
                  .sort((a, b) => b[1][2] - a[1][2]);

    fallen = new Set();
    p1 = 0;
    p2 = 0;
    processingId = -1;
    p1InitState = '';
    boxes = [];
    texts = ['Move/rotate with mouse or arrows', 'Initializing.. '];
}

document.getElementById('load').addEventListener('click', e => {
    autoRun = false;
    input = document.getElementById('custom').value;
    restart();
    draw();
});
