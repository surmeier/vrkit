import * as THREE from 'three';

const InstagramFilter = {
  uniforms: {
    "tDiffuse": { value: null }, 
    "tDepth": { value: null }, // Add depth texture
    "vignette": { value: 0.5 },
    "exposure": { value: 1.0 },
    "aspectRatio": { value: window.innerWidth / window.innerHeight },
    "color": { value: new THREE.Color(1.0, 1.0, 1.0) },
    "fogColor": { value: new THREE.Color(0xAAAAAA) },
    "fogNear": { value: 10.0 },
    "fogFar": { value: 100.0 },
    "blurDepthThreshold": { value: 0.2 } // Depth beyond which the blur is applied
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
    uniform sampler2D tDepth;
    uniform float vignette;
    uniform float exposure;
    uniform float aspectRatio;
    uniform vec3 color;
    uniform vec3 fogColor;
    uniform float fogNear;
    uniform float fogFar;
    uniform float blurDepthThreshold;
    varying vec2 vUv;

    float computeFogFactor() {
      float depth = texture2D(tDepth, vUv).r;
      float fogFactor = smoothstep(fogNear, fogFar, depth);
      return fogFactor;
    }

    vec4 blur() {
      vec2 offset = 1.0 / vec2(aspectRatio, 1.0);
      vec4 blurredColor = texture2D(tDiffuse, vUv + offset) +
                          texture2D(tDiffuse, vUv - offset);
      blurredColor *= 0.5;
      return blurredColor;
    }

    void main() {
      // STEP 1: Map the texture2D
      vec4 texColor = texture2D(tDiffuse, vUv);
      float depth = texture2D(tDepth, vUv).r;

      if(depth > blurDepthThreshold) {
          texColor = blur();
      }

      // STEP 2: Map the position
      vec2 position = vUv * 2.0 - 1.0;
      position.x *= (aspectRatio);

      // STEP 3: Add Vignette Mask
      float dist = length(position);
      float vig_mask = smoothstep(vignette, vignette - 0.1, dist); 
      texColor.rgb *= vig_mask;

      // STEP 4: Apply fog
      float fogFactor = computeFogFactor();
      vec3 foggedColor = mix(texColor.rgb, fogColor, fogFactor);
      texColor.rgb = foggedColor;

      gl_FragColor = texColor;
    }
  `
};

export { InstagramFilter };