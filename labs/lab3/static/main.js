import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { InstagramFilter } from './vignetteShader.js';
import { LensDistortionShader } from './LensDistortionShader.js'
import { CopyShader } from 'three/addons/shaders/CopyShader.js';

// create a scene 
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x556887, 10, 100); // (trying to) add linear fog

// stereo camera setup
var stereocam = new THREE.StereoCamera();
stereocam.eyeSep = 1.5;

// scene camera update
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / 2 / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 7);
camera.lookAt(0, 0, 0);
stereocam.update(camera);

// create a timestamp
const clock = new THREE.Clock();

// Depth setup
const depthMaterial = new THREE.MeshDepthMaterial();
depthMaterial.depthPacking = THREE.RGBADepthPacking;
depthMaterial.blending = THREE.NoBlending;

const depthRenderTargetLeft = new THREE.WebGLRenderTarget(window.innerWidth / 2, window.innerHeight);
const depthRenderTargetRight = new THREE.WebGLRenderTarget(window.innerWidth / 2, window.innerHeight);

// left and right renderers setup
var half_canvas_seperation = 5;

// left
const rendererLeft = new THREE.WebGLRenderer();
rendererLeft.setSize(window.innerWidth / 2 - half_canvas_seperation, window.innerHeight);
rendererLeft.domElement.style.position = 'absolute';
rendererLeft.domElement.style.left = '0px';
rendererLeft.domElement.style.top = '0px';
document.body.appendChild(rendererLeft.domElement);

// right 
const rendererRight = new THREE.WebGLRenderer();
rendererRight.setSize(window.innerWidth / 2 - half_canvas_seperation, window.innerHeight);
rendererRight.domElement.style.position = 'absolute';
rendererRight.domElement.style.left = (window.innerWidth / 2 + half_canvas_seperation) + 'px';
rendererRight.domElement.style.top = '0px';
document.body.appendChild(rendererRight.domElement);

// EffectComposer setup
var renderTargetLeft = new THREE.WebGLRenderTarget(window.innerWidth / 2, window.innerHeight);
var renderTargetRight = new THREE.WebGLRenderTarget(window.innerWidth / 2, window.innerHeight);

const renderPassL = new RenderPass(scene, stereocam.cameraL);
const renderPassR = new RenderPass(scene, stereocam.cameraR);

// add the RenderPasses
const composerLeft = new EffectComposer(rendererLeft, renderTargetLeft);
const composerRight = new EffectComposer(rendererRight, renderTargetRight);

composerLeft.addPass(renderPassL);
composerRight.addPass(renderPassR);

// Vignette Shader Pass
const vignettePassLeft = new ShaderPass(InstagramFilter);
const vignettePassRight = new ShaderPass(InstagramFilter);

// Uniforms for linear fog and depth defocus blur
vignettePassLeft.uniforms.tDepth = { value: depthRenderTargetLeft.texture };
vignettePassRight.uniforms.tDepth = { value: depthRenderTargetRight.texture };
vignettePassLeft.uniforms.fogNear = { value: 10.0 };
vignettePassRight.uniforms.fogNear = { value: 10.0 };
vignettePassLeft.uniforms.fogFar = { value: 100.0 };
vignettePassRight.uniforms.fogFar = { value: 100.0 };
vignettePassLeft.uniforms.blurDepthThreshold = { value: 0.2 };
vignettePassRight.uniforms.blurDepthThreshold = { value: 0.2 };

composerLeft.addPass(vignettePassLeft);
composerRight.addPass(vignettePassRight);

// Lens Distortion Shader Pass
const lensDistortionPassLeft = new ShaderPass(LensDistortionShader);
const lensDistortionPassRight = new ShaderPass(LensDistortionShader);

lensDistortionPassLeft.uniforms.tDiffuse.value = renderTargetLeft.texture;
lensDistortionPassRight.uniforms.tDiffuse.value = renderTargetRight.texture;

// Testing distortion values
lensDistortionPassLeft.uniforms.uK0.value = new THREE.Vector2(0.5, 0.5);
lensDistortionPassRight.uniforms.uK0.value = new THREE.Vector2(0.5, 0.5);

composerLeft.addPass(lensDistortionPassLeft);
composerRight.addPass(lensDistortionPassRight);

// Final Pass to render the output to the screen
const finalPassLeft = new ShaderPass(CopyShader);
finalPassLeft.renderToScreen = true;
const finalPassRight = new ShaderPass(CopyShader);
finalPassRight.renderToScreen = true;

composerLeft.addPass(finalPassLeft);
composerRight.addPass(finalPassRight);

// create a sphere 
const geometry = new THREE.SphereGeometry(2, 16, 16);
const material = new THREE.MeshStandardMaterial({ color: 0x5AD684 });
const sphere = new THREE.Mesh(geometry, material);
sphere.position.set(1, 1, 0);
scene.add(sphere);

// create a plane
const geometry1 = new THREE.PlaneGeometry(7, 7);
const material1 = new THREE.MeshStandardMaterial({ color: 0x556887 });
const plane = new THREE.Mesh(geometry1, material1);
scene.add(plane);

// Add a directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// Add ambient light
const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
scene.add(ambientLight);

function animate() {
    const delta = clock.getDelta();
    stereocam.update(camera);
    requestAnimationFrame(animate);

    // Depth rendering for both left and right
    rendererLeft.setRenderTarget(depthRenderTargetLeft);
    rendererLeft.render(scene, stereocam.cameraL, depthMaterial);
    rendererRight.setRenderTarget(depthRenderTargetRight);
    rendererRight.render(scene, stereocam.cameraR, depthMaterial);

    // Update sphere motion
    sphere.rotation.x += delta;
    sphere.rotation.y += delta;

    // Render both EffectComposers
    rendererLeft.setRenderTarget(renderTargetLeft);
    composerLeft.render();
    rendererRight.setRenderTarget(renderTargetRight);
    composerRight.render();
}

animate();