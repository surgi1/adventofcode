let [flowsLit, cmpsLit] = input.split("\n\n"),
    flows = {}, cmps = [], hyperboxes = [];

flowsLit.split("\n").forEach(line => {
    let [id, opsLit] = line.match(/[^({|})]+/g);
    let ops = opsLit.split(',');
    flows[id] = ops.map(opLit => {
        let tmp = opLit.split(/:/g);
        if (tmp.length == 1) return tmp;

        let [k, v] = tmp[0].split(/<|>/g);

        return [k, tmp[0][1], Number(v), tmp[1]];
    });
})

cmps = cmpsLit.split("\n").map(line => {
    let res = {},
        tmp = line.slice(1, -1).split(',').map(s => s.split('=')).forEach(ar => res[ar[0]] = Number(ar[1]));
    return res;
})

const condValid = ([par, op, val], cmp) => op == undefined || ((op == '>' && cmp[par] > val) || (op == '<' && cmp[par] < val));

const runFlow = (flowId, cmp) => {
    let flow = flows[flowId],
        i = 0;
    while (!condValid(flow[i], cmp)) i++;
    return flow[i][flow[i].length-1];
}

const runFlows = (cmp, opId = 'in') => {
    while (!['A', 'R'].includes(opId)) opId = runFlow(opId, cmp);
    return opId === 'A';
}

console.log('p1', cmps.reduce((res, cmp) => runFlows(cmp) ? res + Object.values(cmp).reduce((a, v) => a+v, 0) : res, 0));

// part 2 backtracks from 'A' all the way back to 'in' flow, while refining ranges along the way
// ... yes, could've walked from 'in' to 'A' as well, would be similar code

let sum = 0, ents = Object.entries(flows);

const backtrack = (resultId, b = {x: [1, 4000], m: [1, 4000], a: [1, 4000], s: [1, 4000]}) => ents.forEach(([id, flow]) => {
    for (let condId = 0; condId < flow.length; condId++) {
        if (flow[condId][flow[condId].length-1] == resultId) {
            let i = condId,
                bounds = {x: b.x.slice(), m: b.m.slice(), a: b.a.slice(), s: b.s.slice()}

            while (i >= 0) {
                if (flow[i].length == 1) {i--; continue;}
                let [par, op, val] = flow[i];
                if (i == condId) {
                    //flow[j] was satisfied
                    if (op == '>') {
                        // x > 5 was satisfied
                        if (bounds[par][0] <= val) bounds[par][0] = val+1;
                    } else {
                        // x < 5 was satisfied
                        if (bounds[par][1] >= val) bounds[par][1] = val-1;
                    }
                } else {
                    //flow[j] was not satisfied
                    if (op == '>') {
                        // x > 5 was not satisfied
                        if (bounds[par][1] > val) bounds[par][1] = val;
                    } else {
                        // x < 5 was not satisfied
                        if (bounds[par][0] < val) bounds[par][0] = val;
                    }
                }
                i--;
            }

            if (id == 'in') {
                if (bounds.x[1] >= bounds.x[0] && bounds.m[1] >= bounds.m[0] && bounds.a[1] >= bounds.a[0] && bounds.s[1] >= bounds.s[0]) {
                    sum += (bounds.x[1] - bounds.x[0]+1) * (bounds.m[1] - bounds.m[0]+1) * (bounds.a[1] - bounds.a[0]+1) * (bounds.s[1] - bounds.s[0]+1);
                    hyperboxes.push(bounds);
                }
            } else backtrack(id, bounds);
        }
    }
})

backtrack('A');

console.log('p2', sum);

let boxes = [], text1, mat1;

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
        const light2 = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(1, 10, 1), scene);
        const light4 = new BABYLON.DirectionalLight("DirectionalLight", new BABYLON.Vector3(0, -1, 0), scene);
        light.intensity = 0.5;

        camera.setPosition(new BABYLON.Vector3(30, 30, -30));

        mat1 = new BABYLON.StandardMaterial("texture1", scene);
        
        mat1.alpha = 1.0;

        hyperboxes.forEach(b => {
            let box = BABYLON.MeshBuilder.CreateBox(
                'box', {
                    height: (b.x[1] - b.x[0]) / 400,
                    width: (b.m[1] - b.m[0]) / 400,
                    depth: (b.a[1] - b.a[0]) / 400,
                    updatable: true
                },
                scene,
            )
            box.material = mat1;
            box.position.x = b.x[0] / 400;
            box.position.y = b.m[0] / 400;
            box.position.z = b.a[0] / 400;
            boxes.push(box);
        })

        // GUI
        var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

        text1 = new BABYLON.GUI.TextBlock();
        text1.text = "Hello world";
        text1.color = "white";
        text1.fontSize = 24;
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
                sceneToRender.render()
            }
        })
    })

    // Resize
    window.addEventListener('resize', function() {
        engine.resize()
    })

    let sval = 1;

    setInterval(() => {
        boxes.forEach((box, i) => {
            if (sval > hyperboxes[i].s[0] && sval < hyperboxes[i].s[1]) box.setEnabled(true);
            else box.setEnabled(false);
        })
        sval++;
        text1.text = 'Move around with mouse or arrows\nX, M, A used as 3D coords\nS = '+ sval;
        if (sval > 4000) {
            sval = 0;
            if (mat1.alpha == 1) mat1.alpha = 0.3; else mat1.alpha = 1;
        }
    }, 10)

}

draw();