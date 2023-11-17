[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/JmtokRwV)
# Lab2_StereoRendering
Program webgl using Three.js library. Hosting the webpage on the Python Flask server.

Hi VR/AR Explorers! Welcome to our second lab: Stereo Rendering with Three.js!

In this assignment, you will be asked to draw a stereo 3D graphics scene using Three.js. You are expected to be learning the amazing related libraries including [StereoCamera](https://threejs.org/docs/#api/en/cameras/StereoCamera), [WebGLRenderer](https://threejs.org/docs/#api/en/renderers/WebGLRenderer), [WebGLRenderTarget](https://threejs.org/docs/#api/en/renderers/WebGLRenderTarget), [EffectComposer](https://threejs.org/docs/#examples/en/postprocessing/EffectComposer), and [RenderPass](https://threejs.org/docs/#manual/en/introduction/How-to-use-post-processing). You can start from setup the environment just like the first assignment.


## Step 1: Environment Setup 

Same as last assignment. Clone the repo, configure the python environment, and run this starter code to see the stereo rendering of a cube.

## Step 2: Understanding Stereo Rendering

Recall the Thursday lecture, we learned that the graphics rendering pipeline includes a model transform for geometry, a view transform for camera setup, and a projection transform for viewing frustum. In this assignment, we will make stereo rendering out of changing the view transform part.

![Theoretical Graphics Rendering Pipeline](/image/Graphics_rendering.png)

For VR rendering, we want to change our original monocular scene camera into a stereo camera so that a scene can be available for both of our eyes. However, stereo rendering for human vision is not as intuition as projecting two identical rendered results in front of both eyes. Due to the distance between our left and right eyes, they have different views on the scene.

![Stereo FOV](/image/Stereo_FOV.png)

Also, when focusing on a specific area of the image plane, our left and right eyes tend to rotate inversely in order to make the target area focused.

![Stereo Focus](/image/Stereo_Focus.png)

Therefore, stereo camera should be able to produce two similar renderings with a slight shift and a tilted angle.

## Step 3: Stereo Camera Setup

In the first assignment, we know that in order to render a scene with objects, we need a PerspectiveCamera, and WebGLRenderer. In VR stereo rendering, we need to calibrate for both the baseline between eyes(two stereo cameras), and the distance between the left and right displays(canvases). The calibration of the eyes distance can be achieve through the stereo camera setting. It is nice that Three.js have a direct buildin [StereoCamera](https://threejs.org/docs/#api/en/cameras/StereoCamera) tool for us to use. You can read the documentation and make changes on the eye seperation so that you are able to create a baseline distance for the stereo camera. The distance between the left and right displays will be explained in the next section.

## Step 4: Stereo Renderer Setup

As for the renderer ([WebGLRenderer](https://threejs.org/docs/#api/en/renderers/WebGLRenderer)), stereo rendering needs two renderer for both left and right eyes. You are also able to play with the renderer and see the update on screen. The default version of the stereo rendering is setted up as the code which display the left and right as two "canvases" on screen. Learn the code and see how to create a distance between the left and right "canvases".

Source : ".domElement.style" can be viewed as the "Element.style" in HTML. Check on changing the position property: https://www.w3schools.com/jsref/prop_style_position.asp, changing the left starting edge of a canvas: https://www.w3schools.com/jsref/prop_style_left.asp, changing the right ending edge of a canvas: https://www.w3schools.com/jsref/prop_style_right.asp, and more at https://www.w3schools.com/jsref/dom_obj_style.asp.

Hint 2 : Here, I initialize the half of the distance to be variable 'half_canvas_separation'. Try to use it into the WebGLRenderer set up.

Hint 3 : You should be able to see a white boarder line in the middle of the screen, which representing the canvas seperation distance.

*Before Canvases Separation*
 
![Before Canvases Separation](/image/before_separation.png)

*After Canvases Separation*
 
![After Canvases Separation](/image/after_separation.png)


## Step 5: EffectComposer Setup

To make it more fun and for our future assignments, we can also treat stereo rendering as a new rendering way. Then, we can also use a post-processing method, [EffectComposer](https://threejs.org/docs/#examples/en/postprocessing/EffectComposer). Post processing methods are methods to extend the common rendering. EffectComposer allow us to see the new interesting world related to effects and render passes. Please go through the [WebGLRenderTarget](https://threejs.org/docs/#api/en/renderers/WebGLRenderTarget), [EffectComposer](https://threejs.org/docs/#examples/en/postprocessing/EffectComposer), and [RenderPass](https://threejs.org/docs/#manual/en/introduction/How-to-use-post-processing) and try to initialize the EffectComposer for stereo rendering. You can also play with it and add more other rendering effects and passes.

Hint 1 : Here you can consider stereo as two (left and right) RenderPasses and add them to the corresponding (left and right) EffectComposers.

Hint 2 : Instead of rendering the WebGLRenderers, you want to render the EffectComposers in each time step.

Hint 3 : If worked, you should be able to see the same thing without WebGLRenderer rendering process.

## Step 6: Migrate Lab1 Scene & Navigation to Current Stereo Pipeline

Migrate your Lab 1 scene to current rendering pipeline. You will be able to see a naive stereo VR version of your Lab 1 creation now!
