# Lab1_Threejs_WebGL_Programming
Program webgl using Three.js library. Hosting the webpage on the Python Flask server.

Hi VR/AR Explorers! Welcome to our first lab: WebGL Programming using Three.js!

In this assignment, you will be asked to draw a 3D graphics scene using Three.js, a WebGL based graphics library for 3D content rendering on webpage. To host the webpage, you are going to use a Python web server framework named Flask to set up your server. (New to web development? No worries, we have the starter code for you!)


## Step 1: Clone the github repo

## Step 2: Configure Python development environment

To create a conda environment for our class, typing:
```
conda create -n CS396VR python=3.8
```
A conda environment CS396VR with python 3.8 will be created. After creating this conda environment, activate it by typing:


```
conda activate CS396VR
```
Install the Flask and Flask_Cors packages we are going to use by
```
pip install Flask
pip install Flask-Cors
```
## Step 3: Run the server in starter code

The server code is already written for you in the starter code. Run the Flask server by executing the main.py file under 'server/' directory:

```
python server/main.py
```

It will return you the following information:

```
 * Serving Flask app 'main'
 * Debug mode: off
WARNING: This is a development server. Do not use it in a production deployment. Use a production WSGI server instead.
 * Running on all addresses (0.0.0.0)
 * Running on http://127.0.0.1:8000
 * Running on http://xx.xx.xx.xx:8000
```
You can verify whether your server is up by opening the links above in the browser:

```
http://127.0.0.1:8000
```
It should return you 'Hello World!' based on the code logic.

More information about Flask can be found in this doc link: https://flask.palletsprojects.com/en/2.3.x/#

## Step 4: Test the three.js code
We have copied the example code from offcial Three.js website (https://threejs.org/docs/index.html#manual/en/introduction/Creating-a-scene) into the /static/main.js file. You should see a rotating green cube after you visit:

```
http://127.0.0.1:8000/index.html
```
## Step 5: Create your virtual 3D scene!

Further modify the /static/main.js file, create your first 3D virtual scene for your later VR display. Your scene should at least contain the following elements:

1. A ground plane.
(https://threejs.org/docs/index.html#api/en/geometries/PlaneGeometry)
2. Four balls locate in the straight front, back, left, and right of the original point.
(https://threejs.org/docs/index.html#api/en/geometries/SphereGeometry)
3. Two 3D models loaded from glTF(GL Transmission Format) files (.GLB, .GLTF). You can find tutorial here: https://threejs.org/docs/index.html#manual/en/introduction/Loading-3D-models
4. Two point light sources which create shadow effect on object. Visualize the light with point light helper.
(https://threejs.org/docs/index.html#api/en/lights/PointLight)
(https://threejs.org/docs/index.html#api/en/lights/shadows/PointLightShadow)
(https://threejs.org/docs/index.html#api/en/helpers/PointLightHelper)
5. Fly the camera by keyboard control and change the look at point by dragging the mouse.
(https://threejs.org/docs/index.html#examples/en/controls/FlyControls)

