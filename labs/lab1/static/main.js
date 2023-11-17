import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { FlyControls } from 'three/addons/controls/FlyControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

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

const lightHelper1 = new THREE.PointLightHelper(light1);
scene.add(lightHelper1);

const lightHelper2 = new THREE.PointLightHelper(light2);
scene.add(lightHelper2);

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
// If you look closely, the dog is wearing the skull.
const models = ["skull.glb", "shiba.glb"];
const loader = new GLTFLoader();
models.forEach(model => {
    loader.load(model, function (gltf) {
        scene.add(gltf.scene);
    }, undefined, function (error) {
        console.error(error);
    });
});

// Fly control
const controls = new FlyControls(camera, renderer.domElement);
controls.movementSpeed = 1.0;
controls.domElement = renderer.domElement;
controls.rollSpeed = Math.PI / 24;
controls.autoForward = false;
controls.dragToLook = true;

function animate() {
  requestAnimationFrame(animate);
  controls.update(1.0);
  renderer.render(scene, camera);
}

animate();