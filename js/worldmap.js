//const DIMENSIONS = 500;
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.158.0/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.158.0/examples/jsm/controls/OrbitControls.js';



const scene = new THREE.Scene();
let camera = createCameraAndLights(scene);
createLights(scene);

//////////////////[Canvas & Renderer]////////////////////////
const canvas = document.querySelector('#fractals');
////const canvas = getCanvas("#fractals");
//canvas = getCanvas("$#fractals");
const renderer = new THREE.WebGLRenderer({canvas});
//const renderer = getRenderer(canva);

const div = document.getElementById("right_side");
const dimensions = div.getBoundingClientRect();

renderer.setPixelRatio(window.devicePixelRatio);
canvas.width = dimensions.width;
canvas.height = dimensions.height;
renderer.setSize( canvas.width, canvas.height);

let objToRender = 'worldMap';
let object;
let continents = RenderObject(scene, objToRender);
let continent;
let highlightedContinent;
//enableControls(camera, scene);
let controls = new OrbitControls(camera, renderer.domElement);
controls.enableRightClick = false;
controls.enableRotate = false;

let uniforms= {
    iResolution: {value: new THREE.Vector3()},
    mouseDelta: {value: new THREE.Vector2()},
    mousePos: {value: new THREE.Vector2()},
    zoomMultiplier: {value: 1.0}};

//////////////////[Listeners]
renderer.domElement.addEventListener('mousemove', onMouseMove);
renderer.domElement.addEventListener('mouseup', onMouseUp);
renderer.domElement.addEventListener('mousedown', onMouseDown);
renderer.domElement.addEventListener("click", onLeftClick)
document.addEventListener('mousemove', () => console.log('doc move'));
let mouseDown = false;
const mouseStart = new THREE.Vector2();
const mouse = new THREE.Vector2();
//////////////////[RAYCASTING]////////////////////////
const raycaster = new THREE.Raycaster();
//const mouse = new THREE.Vector2();
//let continent;

let labelOn = false;

let x = scene.children;

export function updateMap()
{
    uniforms.iResolution.value.set(canvas.width, canvas.height, 1);
    renderer.render(scene, camera);
}

function createCameraAndLights(scene)
{
    //==============[Camera & Lights]===============
    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(0, 6, 3); // REQUIRED
    camera.lookAt(0,0,0);
    return camera;
}
function createLights(scene)
{
    const topLight = new THREE.DirectionalLight(0xffffff, 1); // (color, intensity)
    topLight.position.set(500, 500, 500) //top-left-ish
    topLight.castShadow = true;
    scene.add(topLight);
    return topLight;
}

function RenderObject(scene, objToRender)
{
    let continents = new Set();
    const loader = new GLTFLoader();

    loader.load(
        `./assets/models/${objToRender}.gltf`,
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
    return continents;
}

function enableControls(camera, renderer)
{
    let controls = new OrbitControls(camera, renderer.domElement);
    controls.enableRightClick = false;
    controls.enableRotate = false;
    return controls;
}

function onMouseMove(event)
{
    console.log("We're moving!");
    console.log("client: "+event.clientY);
    //console.log("render: "+renderer.domElement.clientY);
    console.log(dimensions.left);
    console.log(dimensions.top);
    const coords = new THREE.Vector2(
    ((event.clientX -dimensions.left)/ (renderer.domElement.clientWidth)) * 2 - 1,
    -(((event.clientY - dimensions.top) / (renderer.domElement.clientHeight)) * 2 - 1),
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
        sinkContinents(continents);

    }
}

async function sinkContinents(continent)
{
    let cameraY = 5;
    for(let tick = 0; tick< 50; tick++)
    {
        await delay(20);
        for(const c of continent)
        {
            if(c !== continent)
            {
                c.position.y -= 0.005;
            }
        }
    }
    const target = new THREE.Vector3();
    //`continent.getWorldPosition(target);

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
async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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
    }
}

function getContinentCenter(continent)
{
    const box = new THREE.Box3().setFromObject(continent);
    const center = new THREE.Vector3();
    box.getCenter(center);
    return center;
}
export function updateRaycaster()
{
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
function getRenderer(canvas)
{
    return THREE.WebGLRenderer({canvas});

}

function getCanvas(id)
{
    return document.querySelector(id);
}