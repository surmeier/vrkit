import * as THREE from 'three'

export const LensDistortionShader = {

  uniforms: {
    'tDiffuse': { value: null }, // sampler2D
    'uK0': { value: new THREE.Vector2() }, // radial distortion coeff
    'uCc': { value: new THREE.Vector2(0.5, 0.5) }, // principal point (usually center)
    'uFc': { value: new THREE.Vector2(1.0, 1.0) },  // focal length
    'uAlpha_c': { value: 0 }, // skew coeff
  },

  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,

  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform vec2 uK0; // radial distortion coeff 
    uniform vec2 uCc; // principal point
    uniform vec2 uFc; // focal length
    uniform float uAlpha_c; // skew coeff
    varying vec2 vUv;
    
    void main() {
      // STEP 1: Ranging r_d from (-1,1)
      vec2 rd = vUv * 2.0 - 1.0;

      // Adjusting for principal point and focal length
      rd = (rd - uCc) / uFc;

      // STEP 2: Distortion
      float r = length(rd);
      vec2 ru = rd * (1.0 + uK0.x * r * r); 

      // STEP 3: Projection
      ru = ru * uFc + uCc;
      ru = ru * 0.5 + 0.5; 

      // STEP 4: gl_FragColor update
      if(ru.x >= 0.0 && ru.x <= 1.0 && ru.y >= 0.0 && ru.y <= 1.0) {
        gl_FragColor = texture2D(tDiffuse, ru);
      } else {
        gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0); // Out of bounds, use a magenta color
      }
    }
  `
};