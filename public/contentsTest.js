
// import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.112/build/three.module.js";

import * as THREE from "./threejs/build/three.module.js";
import { OrbitControls } from './threejs/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from './threejs/examples/jsm/loaders/GLTFLoader.js'
import Stats from './threejs/examples/jsm/libs/stats.module.js'


const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("contents") });
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor( 0xffffff, 0 ); // the default
camera.position.setZ(300);

/*===== lights =====*/

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(-100,100,100);
scene.add(pointLight);
const pointLight2 = new THREE.PointLight(0xffffff);
pointLight2.position.set(100,100,100);
scene.add(pointLight2);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);

/*===== light helpers =====*/

const lightHelper = new THREE.PointLightHelper(pointLight);
scene.add(lightHelper);
const lightHelper2 = new THREE.PointLightHelper(pointLight2);
scene.add(lightHelper2);

// const gridHelper = new THREE.GridHelper(200,50);
// scene.add(gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);

//===== MODEL =====// 

let selectedAnimalName = "horse";
let selectedAnimal;

const animalModels = {
    "horse" : {
        "gltfFilePath":"public/animal/animal_horse_combi.glb"
    }
}

class Animal {
    constructor(animalName=""){
        this.animalName = animalName;
        this.modelObject;
        this.modelReady = false;

        this.mixer;

        this.animationActions = {};
        this.activeAction;
        this.lastAction;
    }
    loadModel(){
        const gltfLoader = new GLTFLoader();
        this.modelObject = gltfLoader.load(
            animalModels[this.animalName].gltfFilePath,
            (gltf) => {
                this.mixer = new THREE.AnimationMixer(gltf.scene);

                this.animationActions["idle"] = this.mixer.clipAction(gltf.animations[0]);
                this.animationActions["walk"] = this.mixer.clipAction(gltf.animations[2]);
                this.animationActions["run"] = this.mixer.clipAction(gltf.animations[1]);

                this.activeAction = this.animationActions["idle"];
                gltf.scene.scale.setX(50).setY(50).setZ(50);
                scene.add(gltf.scene);
                this.modelReady = true
            },
            (onload) => {
                console.log((onload.loaded / onload.total * 100) + '% loaded')
            },
            (error) => {
                console.log(error);
            }
        )
    }
    setAction(toAction){
        if (toAction != this.activeAction) {
            this.lastAction = this.activeAction
            this.activeAction = toAction
            // lastAction.stop()
            this.lastAction.fadeOut(1)
            this.activeAction.reset()
            this.activeAction.fadeIn(1)
            this.activeAction.play()
        }
    }
    removeModel(){
        scene.remove(this.modelObject);
    }

}

selectedAnimal = new Animal(selectedAnimalName);
selectedAnimal.loadModel();

// let mixer;
// let modelReady = false;
// let animationActions = new Array();
// let activeAction;
// let lastAction;
// const gltfLoader = new GLTFLoader();


// gltfLoader.load(
//     'public/animal/animal_horse_combi.glb',
//     (gltf) => {
//         mixer = new THREE.AnimationMixer(gltf.scene);
//         let animationAction0 = mixer.clipAction(gltf.animations[0]);
//         animationActions.push(animationAction0)
//         animationsFolder.add(animations, "idle")

//         let animationAction1 = mixer.clipAction(gltf.animations[2]);
//         animationActions.push(animationAction1)
//         animationsFolder.add(animations, "walk")

//         let animationAction2 = mixer.clipAction(gltf.animations[1]);
//         animationActions.push(animationAction2)
//         animationsFolder.add(animations, "run")

//         activeAction = animationActions[0]

//         gltf.scene.scale.setX(50).setY(50).setZ(50);

//         scene.add(gltf.scene);

//         animationActions[0].play();
//         modelReady = true
//     },
//     (xhr) => {
//         console.log((xhr.loaded / xhr.total * 100) + '% loaded')
//     },
//     (error) => {
//         console.log(error);
//     }
// )



// window.addEventListener('resize', onWindowResize, false)
// function onWindowResize() {
//     camera.aspect = window.innerWidth / window.innerHeight
//     camera.updateProjectionMatrix()
//     renderer.setSize(window.innerWidth, window.innerHeight)
//     render()
// }

const stats = Stats()
document.body.appendChild(stats.dom)

// var animations = {
//     idle: function () {
//         setAction(animationActions[0])
//     },
//     walk: function () {
//         setAction(animationActions[1])
//     },
//     run: function () {
//         setAction(animationActions[2])
//     }
// }





const clock = new THREE.Clock()

var animate = function () {
    requestAnimationFrame(animate)

    controls.update()

    if (selectedAnimal.modelReady) selectedAnimal.mixer.update(clock.getDelta());

    render()

    stats.update()
};

function render() {
    renderer.render(scene, camera)
}
animate();


setTimeout(() => {
    selectedAnimal.setAction(selectedAnimal.animationActions['run'])
    setTimeout(() => {
        selectedAnimal.setAction(selectedAnimal.animationActions['walk'])
    }, 5000);
}, 5000);