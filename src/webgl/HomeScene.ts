import * as THREE from 'three';
import { getSharedGLTFLoader } from './GLTFLoaderHelper';

export class HomeScene extends THREE.Group {
  private model: THREE.Group | null = null;
  private bgGradientMesh: THREE.Mesh | null = null;
  private clouds: THREE.Mesh[] = [];

  constructor() {
    super();
    this.setupLighting();
    this.setupBgGradient();
    this.setupClouds();
    this.loadModel();
  }

  private setupLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    this.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfffaed, 2.2);
    keyLight.position.set(6, 12, 8);
    keyLight.castShadow = true;
    this.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xe8f0ee, 0.8);
    fillLight.position.set(-6, 4, -4);
    this.add(fillLight);
  }

  private setupBgGradient() {
    // Subtle background gradient plane
    const geo = new THREE.PlaneGeometry(60, 40);
    const vertShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;
    const fragShader = `
      varying vec2 vUv;
      void main() {
        vec3 topColor = vec3(0.92, 0.90, 0.87);     // cream
        vec3 bottomColor = vec3(0.03, 0.24, 0.16);  // #083D2A
        vec3 col = mix(bottomColor, topColor, smoothstep(0.1, 0.85, vUv.y));
        gl_FragColor = vec4(col, 1.0);
      }
    `;
    const mat = new THREE.ShaderMaterial({
      vertexShader: vertShader,
      fragmentShader: fragShader,
      depthWrite: false,
    });
    this.bgGradientMesh = new THREE.Mesh(geo, mat);
    this.bgGradientMesh.position.set(0, 5, -15);
    this.add(this.bgGradientMesh);
  }

  private setupClouds() {
    const textureLoader = new THREE.TextureLoader();
    const cloudTextures = [1, 2, 3, 4, 5, 6].map(i =>
      textureLoader.load(`/assets/textures/global/clouds/cloud${i}.png`)
    );

    for (let i = 0; i < 6; i++) {
      const tex = cloudTextures[i % cloudTextures.length];
      const mat = new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        opacity: 0.35,
        depthWrite: false,
      });

      const plane = new THREE.Mesh(new THREE.PlaneGeometry(8, 4), mat);
      plane.position.set(
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 4 + 4,
        (Math.random() - 0.5) * 6 - 8
      );
      this.clouds.push(plane);
      this.add(plane);
    }
  }

  private loadModel() {
    const loader = getSharedGLTFLoader();
    loader.load(
      '/assets/models/home/scene_v9.glb',
      (gltf) => {
        this.model = gltf.scene;
        // Position architectural studio room directly in view
        this.model.position.set(0, 0, 0);
        this.model.scale.set(1.0, 1.0, 1.0);

        this.model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        this.add(this.model);
      },
      undefined,
      (err) => console.warn('Home model warning:', err)
    );
  }

  public update(time: number, scrollY: number) {
    if (!this.visible) return;

    if (this.model) {
      // Very gentle parallax rotation on scroll
      this.model.rotation.y = scrollY * 0.00015;
    }

    this.clouds.forEach((cloud, idx) => {
      cloud.position.x += Math.sin(time * 0.15 + idx) * 0.002;
    });
  }
}
