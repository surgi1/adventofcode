// visuals!

let arr = input.split("\n").map(line => {
    let [pLit, vLit] = line.split('@');
    return {
        p: pLit.split(',').map(Number),
        v: vLit.split(',').map(Number)
    }
})

let scale = 50/Math.max(...arr.map(o => o.p[0])), 
    tInc = Math.ceil(0.0001/scale);

const updateText = () => {
    texts[1] = 't = '+t;
    text1.text = texts.join('\n');
}

let boxes = [], texts = ['Red = X, Green = Y, Blue = Z', 't = 0'], text1;
let t = 0;

const update = boxes => {
    arr.forEach((b, i) => {
        let h = scale,
            w = scale,
            d = scale;

        boxes[i].position.y = scale*(b.p[1] + t * b.v[1]);
        boxes[i].position.x = scale*(b.p[0] + t * b.v[0])
        boxes[i].position.z = scale*(b.p[2] + t * b.v[2])
    })
}
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

        arr.forEach(b => {

            let mat = new BABYLON.StandardMaterial("texture1", scene);

            mat.diffuseColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
            
            mat.alpha = 1.0;

            let box = BABYLON.Mesh.CreateSphere("sphere", 10, 0.5, scene, false,  BABYLON.Mesh.DEFAULTSIDE);

            box.material = mat;
            boxes.push(box);
        })

        const axes = new BABYLON.AxesViewer(scene, 10);

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
                //t += 1000000000;
                t += tInc;
                update(boxes);
            }
        })
    })

    // Resize
    window.addEventListener('resize', function() {
        engine.resize()
    })
}

draw();

const restart = () => {
    arr = input.split("\n").map(line => {
        let [pLit, vLit] = line.split('@');
        return {
            p: pLit.split(',').map(Number),
            v: vLit.split(',').map(Number)
        }
    })
    boxes = [];
    scale = 50/Math.max(...arr.map(o => o.p[0]));
    tInc = 0.01/scale; // so example works
    if (tInc > 1) tInc = Math.ceil(0.0001/scale);
    console.log(tInc);
    t = 0;
    texts = ['Move/rotate with mouse or arrows', 'Initializing.. '];
}

document.getElementById('load').addEventListener('click', e => {
    autoRun = false;
    input = document.getElementById('custom').value;
    restart();
    draw();
});
