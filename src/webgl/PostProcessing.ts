import * as THREE from 'three';

const fluidDistortionShader = {
  uniforms: {
    tDiffuse: { value: null },
    tVelocity: { value: null },
    uDistortionStrength: { value: 0.0035 },
    uVelocityScale: { value: 1.5 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform sampler2D tVelocity;
    uniform float uDistortionStrength;
    uniform float uVelocityScale;
    varying vec2 vUv;

    void main() {
      vec2 vel = texture2D(tVelocity, vUv).xy * uVelocityScale;
      vec2 distortedUv = vUv + vel * uDistortionStrength;

      // Slight chromatic aberration based on fluid disturbance
      float r = texture2D(tDiffuse, distortedUv + vel * 0.001).r;
      float g = texture2D(tDiffuse, distortedUv).g;
      float b = texture2D(tDiffuse, distortedUv - vel * 0.001).b;

      gl_FragColor = vec4(r, g, b, 1.0);
    }
  `
};

export class PostProcessing {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.OrthographicCamera;
  private quad: THREE.Mesh;
  private material: THREE.ShaderMaterial;
  private renderTarget: THREE.WebGLRenderTarget;

  constructor(renderer: THREE.WebGLRenderer, width: number, height: number) {
    this.renderer = renderer;

    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    this.renderTarget = new THREE.WebGLRenderTarget(width, height, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
    });

    this.material = new THREE.ShaderMaterial({
      vertexShader: fluidDistortionShader.vertexShader,
      fragmentShader: fluidDistortionShader.fragmentShader,
      uniforms: THREE.UniformsUtils.clone(fluidDistortionShader.uniforms),
      depthTest: false,
      depthWrite: false,
    });

    this.quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.material);
    this.scene.add(this.quad);
  }

  public get target(): THREE.WebGLRenderTarget {
    return this.renderTarget;
  }

  public render(velocityTexture: THREE.Texture) {
    this.material.uniforms.tDiffuse.value = this.renderTarget.texture;
    this.material.uniforms.tVelocity.value = velocityTexture;

    this.renderer.setRenderTarget(null);
    this.renderer.render(this.scene, this.camera);
  }

  public resize(width: number, height: number) {
    this.renderTarget.setSize(width, height);
  }
}
