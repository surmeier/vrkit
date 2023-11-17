import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { FlyControls } from 'three/addons/controls/FlyControls.js';

// create a scene 
const scene = new THREE.Scene();

// Stereo Camera Setup
var stereocam = new THREE.StereoCamera();
stereocam.eyeSep = 0.064;  // Note: average human IPD is ~64mm

// Scene Camera Update
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / 2 / window.innerHeight, 0.1, 1000);
camera.position.set(0, 10, 15);
camera.lookAt(0, 0, 0);
stereocam.update(camera);

const clock = new THREE.Clock();

// Canvas Separation Logic
var half_canvas_separation = 20;
const rendererLeft = new THREE.WebGLRenderer({ antialias: true });
rendererLeft.setSize(window.innerWidth / 2 - half_canvas_separation, window.innerHeight);
rendererLeft.domElement.style.position = 'absolute';
rendererLeft.domElement.style.left = '0px';
rendererLeft.domElement.style.top = '0px';
document.body.appendChild(rendererLeft.domElement);

const rendererRight = new THREE.WebGLRenderer({ antialias: true });
rendererRight.setSize(window.innerWidth / 2 - half_canvas_separation, window.innerHeight);
rendererRight.domElement.style.position = 'absolute';
rendererRight.domElement.style.left = (window.innerWidth / 2 + half_canvas_separation) + 'px';
rendererRight.domElement.style.top = '0px';
document.body.appendChild(rendererRight.domElement);

// EffectComposer Setup
const renderPassL = new RenderPass(scene, stereocam.cameraL);
const renderPassR = new RenderPass(scene, stereocam.cameraR);

var renderTargetLeft = new THREE.WebGLRenderTarget(window.innerWidth/2 - half_canvas_separation, window.innerHeight);
var renderTargetRight = new THREE.WebGLRenderTarget(window.innerWidth/2 - half_canvas_separation, window.innerHeight);

const effectComposerL = new EffectComposer(rendererLeft, renderTargetLeft);
const effectComposerR = new EffectComposer(rendererRight, renderTargetRight);

effectComposerL.addPass(renderPassL);
effectComposerR.addPass(renderPassR);

// Ground plane
const groundGeometry = new THREE.PlaneGeometry(500, 500, 32, 32);
const groundMaterial = new THREE.MeshPhongMaterial({ color: 0xAAAAAA });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2; 
ground.receiveShadow = true;
scene.add(ground);

// Light sources
const light1 = new THREE.PointLight(0xFFFFFF, 1, 100);
light1.position.set(10, 10, 10);
light1.castShadow = true;
scene.add(light1);

const light2 = new THREE.PointLight(0xFFFFFF, 1, 100);
light2.position.set(-10, -10, -10);
light2.castShadow = true;
scene.add(light2);

// Balls
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xFF0000 });
const positions = [new THREE.Vector3(2, 0, 0), new THREE.Vector3(-2, 0, 0), new THREE.Vector3(0, 0, 2), new THREE.Vector3(0, 0, -2)];

positions.forEach(pos => {
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphere.position.copy(pos);
  sphere.castShadow = true;
  scene.add(sphere);
});

// External models
const models = ["skull.glb", "shiba.glb"];
const loader = new GLTFLoader();
models.forEach(model => {
    loader.load(model, function (gltf) {
        scene.add(gltf.scene);
    }, undefined, function (error) {
        console.error(error);
    });
});

// Fly control (options: use left dom, or invisible doc)
const controls = new FlyControls(camera, document);
controls.movementSpeed = 1.0;
controls.rollSpeed = Math.PI / 24;
controls.autoForward = false;
controls.dragToLook = true;

function animate() {
	const delta = clock.getDelta();
  stereocam.update(camera);
  requestAnimationFrame(animate);

  // Update the controls
  controls.update(delta);

  // Using the EffectComposers to render
  effectComposerL.render(delta);
  effectComposerR.render(delta);
}

animate();