//import * as THREE from 'three';
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.181.0/build/three.module.js";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as gameObjs from './objectDefs.js';

let mouseDown = false;
let mouseStart = new THREE.Vector2();
let highlightedContinent;
let highlightedLabel;
window.addEventListener('mousemove', onMouseMove);
window.addEventListener('mouseup', onMouseUp);
window.addEventListener('mousedown', onMouseDown);
window.addEventListener("click", onLeftClick)

const poop = new gameObjs.Continent("hello", 100, 1000, 10);
console.log(poop.cost);




const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(0, 6, 3); // REQUIRED

let object;
let controls;
let objToRender = 'worldMap';


//////////////////[LOADING]////////////////////////
let continents = new Set();
const loader = new GLTFLoader();

loader.load(
    `./${objToRender}.gltf`,
    function (gltf) {
        //If the file is loaded, add it to the scene
        object = gltf.scene;
        scene.add(object);
        object.traverse(function (child) {
            if (child.isMesh)
            {
                let root = child;
                while (root.parent != null && root.parent !== object)
                {
                    root = root.parent;
                }
                if(root.name !== "Ocean")
                {
                    continents.add(root);
                }

            }
        })
    }
);

const renderer = new THREE.WebGLRenderer({alpha: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("worldMap").appendChild(renderer.domElement);


const topLight = new THREE.DirectionalLight(0xffffff, 1); // (color, intensity)
topLight.position.set(500, 500, 500) //top-left-ish
topLight.castShadow = true;
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0x333333, objToRender === "dino" ? 5 : 1);
scene.add(ambientLight);

//////////////////[CONTROLS]////////////////////////
controls = new OrbitControls(camera, renderer.domElement);
controls.enableRightClick = false;
controls.enableRotate = false;

//////////////////[RAYCASTING]////////////////////////
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let continent;

let labelOn = false;

let x = scene.children;
console.log(continents.size);
for(const c of continents)
{
    console.log("yo");
    console.log(c);
}


function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    raycaster.setFromCamera(mouse, camera);
    const intersection = raycaster.intersectObjects(scene.children, true);

    if(intersection.length > 0 && intersection[0].object.name !== "Ocean")
    {

        let root = intersection[0].object;
        while (root.parent != null && root.parent !== object)
        {
            root = root.parent;
        }
        continent = root;
        hoverContinent(continent);
        highlightedContinent = continent


    }
    for(const c of continents)
    {
        if(c !== continent)
        {
            if(c.position.y > 0)
            {
                c.position.y -= 0.01
            }
        }
    }
}

window.addEventListener("resize", function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate()


function onMouseMove(event)
{
    const coords = new THREE.Vector2(
    (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
    -((event.clientY / renderer.domElement.clientHeight) * 2 - 1),
    );
    mouse.x = coords.x;
    mouse.y = coords.y;

}

function onMouseDown(event)
{
    mouseDown = true;
    mouseStart.x = mouse.x;
    mouseStart.y = mouse.y;
}
function onMouseUp(event) {
    mouseDown = false;
}
function onLeftClick(event)
{
    let pov = continent.position;
    if(continent.name !== "Ocean")
    {
        //console.log("Hover position" + hover.position.x + hover.position.y + hover.position.z);
        sinkContinents(continent);

    }
}
async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function sinkContinents(continent)
{
    let cameraY = 5;
    for(let tick = 0; tick< 50; tick++)
    {
        await delay(20);
        for(const c of continents)
        {
            if(c !== continent)
            {
                c.position.y -= 0.005;
            }
        }
    }
    const target = new THREE.Vector3();
    continent.getWorldPosition(target);

    let steps = new THREE.Vector3();
    let center = getContinentCenter(continent);
    let num = 20;
    let dirVec = center.clone().sub(camera.position);


    let distance = camera.position.distanceTo(getContinentCenter(continent));
    let viewSize = camera.getViewSize(distance, target);
    let continentSize = getContinentSize(continent);
    const zoomMultiplier = Math.min(viewSize.x/continentSize.x, viewSize.y/continentSize.y) / num;

    for(let i = 0; i<num;i++)
    {
        await delay(20);
        camera.position.set(camera.position.x + (dirVec.x/num), camera.position.y + (dirVec.y/num), camera.position.z + (dirVec.z/num) );
        camera.updateProjectionMatrix();
    }
}

function getContinentSize(continent)
{
    const box = new THREE.Box3().setFromObject(continent);
    const size = new THREE.Vector3();
    box.getSize(size);
    return new THREE.Vector2(size.x, size.z);

}
function getContinentCenter(continent)
{
    const box = new THREE.Box3().setFromObject(continent);
    const center = new THREE.Vector3();
    box.getCenter(center);
    return center;
}
function getContinentLabel(continent)
{
    console.log(continent.name);
    const shape = new THREE.Shape();
    const labelWidth = 1;
    const labelHeight = 0.4;

    shape.moveTo(-labelWidth/2,labelHeight/2);
    shape.lineTo(labelWidth/2,labelHeight/2);
    shape.lineTo(labelWidth/2,-labelHeight/2); //bottom right
    shape.lineTo(labelWidth/8,-labelHeight/2); //right triangle
    shape.lineTo(0,-labelHeight/2 - 0.2); //bottom triangle
    shape.lineTo(-labelWidth/8,-labelHeight/2); //left triangle
    shape.lineTo(-labelWidth/2,-labelHeight/2);

    //shape.lineTo(center.x, center.y);
    return shape;
}
function hoverContinent(continent)
{
    if(continent.position.y <= 0.25 && continent.name !== ("Ocean"))
    {
        continent.position.y += 0.01;
    }
    if(highlightedContinent !== continent)
    {
        const center = getContinentCenter(continent);
        scene.remove(highlightedLabel)
        let labelShape = new THREE.ShapeGeometry(getContinentLabel(continent));
        const labelMaterial = new THREE.MeshBasicMaterial({color: 0x2C5F12});
        const label = new THREE.Mesh(labelShape, labelMaterial);
        highlightedLabel = label;
        let posp = toScreenPos(center, camera)
        label.position.set(center.x, center.y + 2, center.z);
        scene.add(label);
        label.quaternion.copy(camera.quaternion);
        labelOn = true;
    }
}


//Stole this from https://stackoverflow.com/questions/27409074/converting-3d-position-to-2d-screen-position-r69
function toScreenPos(center, camera)
{
    var vector = center.clone();
    vector.project(camera);

    var widthHalf = 0.5*window.innerWidth;
    var heightHalf = 0.5*window.innerHeight;

    //obj.updateMatrixWorld();
    //vector.setFromMatrixPosition(obj.matrixWorld);
    //vector.project(camera);

    vector.x = ( vector.x * widthHalf ) + widthHalf;
    vector.y = - ( vector.y * heightHalf ) + heightHalf;

    return {
        x: vector.x,
        y: vector.y
    };
}