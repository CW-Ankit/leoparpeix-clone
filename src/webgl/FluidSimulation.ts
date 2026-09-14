import * as THREE from 'three';

// Vertex shader for fullscreen passes
const baseVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

// Splat shader: adds velocity impulses where mouse moves
const splatShader = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTarget;
  uniform float uAspectRatio;
  uniform vec2 uPoint;
  uniform vec3 uColor;
  uniform float uRadius;

  void main() {
    vec2 p = vUv - uPoint;
    p.x *= uAspectRatio;
    vec3 splat = exp(-dot(p, p) / uRadius) * uColor;
    vec3 base = texture2D(uTarget, vUv).xyz;
    gl_FragColor = vec4(base + splat, 1.0);
  }
`;

// Advection & Dissipation shader: simulates fluid movement and decay
const advectionShader = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uVelocity;
  uniform sampler2D uSource;
  uniform vec2 uTexelSize;
  uniform float uDt;
  uniform float uDissipation;

  void main() {
    vec2 coord = vUv - uDt * texture2D(uVelocity, vUv).xy * uTexelSize;
    gl_FragColor = uDissipation * texture2D(uSource, coord);
  }
`;

export class FluidSimulation {
  private renderer: THREE.WebGLRenderer;
  private width: number;
  private height: number;
  private simRes: number = 128; // Simulation grid resolution

  private scene: THREE.Scene;
  private camera: THREE.Camera;
  private quad: THREE.Mesh;

  private velFboA: THREE.WebGLRenderTarget;
  private velFboB: THREE.WebGLRenderTarget;

  private splatMaterial: THREE.ShaderMaterial;
  private advectionMaterial: THREE.ShaderMaterial;

  private lastMouse: THREE.Vector2 = new THREE.Vector2(0.5, 0.5);
  private currentMouse: THREE.Vector2 = new THREE.Vector2(0.5, 0.5);
  private hasMoved: boolean = false;

  constructor(renderer: THREE.WebGLRenderer, width: number, height: number) {
    this.renderer = renderer;
    this.width = width;
    this.height = height;

    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2));
    this.scene.add(this.quad);

    const fboParams: THREE.RenderTargetOptions = {
      type: THREE.HalfFloatType,
      format: THREE.RGBAFormat,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      depthBuffer: false,
      stencilBuffer: false,
    };

    this.velFboA = new THREE.WebGLRenderTarget(this.simRes, this.simRes, fboParams);
    this.velFboB = new THREE.WebGLRenderTarget(this.simRes, this.simRes, fboParams);

    this.splatMaterial = new THREE.ShaderMaterial({
      vertexShader: baseVertexShader,
      fragmentShader: splatShader,
      uniforms: {
        uTarget: { value: null },
        uAspectRatio: { value: width / height },
        uPoint: { value: new THREE.Vector2() },
        uColor: { value: new THREE.Vector3() },
        uRadius: { value: 0.0015 },
      },
      depthTest: false,
      depthWrite: false,
    });

    this.advectionMaterial = new THREE.ShaderMaterial({
      vertexShader: baseVertexShader,
      fragmentShader: advectionShader,
      uniforms: {
        uVelocity: { value: null },
        uSource: { value: null },
        uTexelSize: { value: new THREE.Vector2(1 / this.simRes, 1 / this.simRes) },
        uDt: { value: 0.016 },
        uDissipation: { value: 0.96 }, // Fluid momentum decay
      },
      depthTest: false,
      depthWrite: false,
    });
  }

  public get velocityTexture(): THREE.Texture {
    return this.velFboA.texture;
  }

  public onPointerMove(x: number, y: number) {
    const normX = x / this.width;
    const normY = 1.0 - y / this.height;

    this.currentMouse.set(normX, normY);
    this.hasMoved = true;
  }

  public update(dt: number = 0.016) {
    // 1. If mouse moved, splat impulse into velocity FBO
    if (this.hasMoved) {
      const deltaX = (this.currentMouse.x - this.lastMouse.x) * 10.0;
      const deltaY = (this.currentMouse.y - this.lastMouse.y) * 10.0;

      this.splatMaterial.uniforms.uTarget.value = this.velFboA.texture;
      this.splatMaterial.uniforms.uAspectRatio.value = this.width / this.height;
      this.splatMaterial.uniforms.uPoint.value.copy(this.currentMouse);
      this.splatMaterial.uniforms.uColor.value.set(deltaX, deltaY, 0.0);
      this.splatMaterial.uniforms.uRadius.value = 0.002;

      this.quad.material = this.splatMaterial;
      this.renderer.setRenderTarget(this.velFboB);
      this.renderer.render(this.scene, this.camera);

      // Swap
      const temp = this.velFboA;
      this.velFboA = this.velFboB;
      this.velFboB = temp;

      this.lastMouse.copy(this.currentMouse);
      this.hasMoved = false;
    }

    // 2. Advect and diffuse velocity
    this.advectionMaterial.uniforms.uVelocity.value = this.velFboA.texture;
    this.advectionMaterial.uniforms.uSource.value = this.velFboA.texture;
    this.advectionMaterial.uniforms.uDt.value = dt;

    this.quad.material = this.advectionMaterial;
    this.renderer.setRenderTarget(this.velFboB);
    this.renderer.render(this.scene, this.camera);

    // Swap back
    const temp = this.velFboA;
    this.velFboA = this.velFboB;
    this.velFboB = temp;

    this.renderer.setRenderTarget(null);
  }

  public resize(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.splatMaterial.uniforms.uAspectRatio.value = width / height;
  }
}
