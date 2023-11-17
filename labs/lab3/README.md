[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/5FR4Rzv8)
# Lab3-vignette-compensate-and-lens-distortions
Program webgl using Three.js library. Hosting the webpage on the Python Flask server.

Hi VR/AR Explorers! Welcome to our third lab: Vignette and Lens Distortion Shaders with Three.js!

This assignment can be a little challenging for ones who are not proficient in GLSL but also really fun! Two main parts are included. Firstly, you will be asked to implement a vignette effect compensation shader where you can get better on the interesting vertex and fragment shader programmings. As you get more familiar with GLSL, you can move on rendering to correct the lens distortion. In this part, you will need to implement the barrel distortion algorithm inside the fragment shader. Besides the GLSL shader programming, you will also learn about a new Three.js library [ShaderPass](https://threejs.org/docs/#manual/en/introduction/How-to-use-post-processing).


## Step 1: Environment Setup 

Same as last two assignments. Clone the repo, configure the python environment, and run this starter code to see the stereo rendering of a sphere.

## Step 2: Understanding Vertex and Fragment Shaders

Recall our last Thursday lecture, we learned about how vertex and fragment shaders involved with the general graphics rendering.

![Vertex and Fragment Shaders](/image/shaders.png)

We will be using OpenGL Shading Language([GLSL](https://www.khronos.org/opengl/wiki/OpenGL_Shading_Language)) to program for both shaders. To better understand how they communicate with each other, please read the below [graph](http://stanford.edu/class/ee267/lectures/lecture4.pdf) carefully and see what types of inputs and outputs of both shaders. This is really important for the future parts.

![GLSL Shader](/image/GLSL_shader.png)

## Step 3: Vignette Shader

Look at the below vignette effect image, what is the difference with a normal image? 

A fading away filter is added on the edge! This is exactly [Vignette Effect](https://www.adobe.com/creativecloud/photography/hub/guides/how-to-create-vignette-effect.html). 

![Vignette Effect](/image/GLSL_Vignette_Example.png)

This is normally what we will see when we put on VR if we do not compensate for vignette effect that caused by lenses. However, we do want to get nice evenly colored renderings. Therefore, a reverse vignette effect, vignette compensation, is normally used. It can create a rendering with original coloring in the middle but brighter on the edges. 

What we first want to do here is to setup a vignette shader pass in GLSL and add it into [ShaderPass](https://threejs.org/docs/#manual/en/introduction/How-to-use-post-processing). [CopyShader](https://github.com/mrdoob/three.js/blob/master/examples/jsm/shaders/CopyShader.js) in the starter main.js code can help on understanding how to define a ShaderPass in Three.js. You can click the CopyShader link to see how the code is like. Compare the CopyShader code and the vignetteShader.js starter code to understand.

Then, the challenging and interesting vignetter shader setup part comes along. Threejs have a lot of build-in uniforms and attributes at https://threejs.org/docs/#api/en/renderers/webgl/WebGLProgram. Make sure to have a glance of it and you can definitely find a bit more helpful when comparing this with the above Vertex and Fragment Shaders graph in Step 2.

Follow the comments in vignetteShader.js which I hope can be a helper of coding. The brightness of renderings should be fading away due to the vignette effect at edges initially, which is exactly what the lens would make us to see. The compensation of vignette effect should make the image brighter on the edges which will make the image looks nicer for us to see in front of lenses. As the Vignette shader is ready, you can import it by initializing and adding the ShaderPass into the EffectComposer we had from last lab. 

Hint 1: uv:vec2 is uv = fragCoord.xy / iResolution.xy; To better understand it, check on https://discoverthreejs.com/book/first-steps/textures-intro/.

Hint 2: For any GLSL question, the documentation is always waiting for you to check on it. https://www.opengl.org/sdk/docs/tutorials/TyphoonLabs/. I personally find the Chapter 2 and 3 are really helpful.

Hint 3: Try to avoid of using the "pure" red, green, and blue colors in the geometry setting like 0xff0000, 0x00ff00, and 0x0000ff.

Hint 4: For the result, you are expected to get something like the image below. The scale and the intensity might differ due to the way and value of your team's implementation.

![Vignette Result](/image/vignetteResult.png)


## Step 4: Lens Distortion Shader

To understand why we need this shader for our VR device, we need to understand the VR lens first. Recall our Tuesday lecture, most VR devices design their lens to distort a input image in a pincushion distortion way. In order to get a even and flat input image, we will need to implement a barrel distortion on our image so that we can see the nicely look image with our binocular eyes.

![Distortions](/image/distortions.png)

![Distortions Explain](/image/distortionExp.png)

What we need for the images is to create the barrel distortion to "correct" the pincushion distortion input back to normal. You are welcome to find some online sources of the barrel distortion equations, and I will introduce one here. To get more detailed on how to achieve, you can check on this site: http://marcodiiga.github.io/radial-lens-undistortion-filtering. Then, you can try to understand the equations and code in the site and achieve it yourself along with the helper comments in LensDistortionShader.js.

![Barrel Equation](/image/barrelEqu.png)

Hint 1: For the result, you are expected to get something like the image below. The value of distortion and focal length might differ how it looks. The green part can be other color depending on how you set the gl_FragColor to be. We set green here just want to highlight where this region of pixels got set. In the final design we will set it to pure black to save the energy.

![Result](/image/result.png)

## Step 5: Replace the Scene with Your Previous Creation

Add objects and make the scene and the camera perspective more fun to look at!

## Step 6: Add Other Interesting Shader Pass (Optional, 1 Extra Point Each. At Max 3pts.)

Add your own interesting pass! For example, the linear fog and depth defocus blur we taught in the lecture.
