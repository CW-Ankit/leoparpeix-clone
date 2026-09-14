import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class AboutScene extends THREE.Group {
  private model: THREE.Group | null = null;
  private flower: THREE.Group | null = null;
  private mountainMesh: THREE.Mesh | null = null;

  constructor() {
    super();
    this.setupLighting();
    this.setupMountainBackground();
    this.loadModels();
  }

  private setupLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    this.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffe8d6, 2.2);
    dirLight.position.set(-6, 12, 8);
    this.add(dirLight);
  }

  private setupMountainBackground() {
    const texLoader = new THREE.TextureLoader();
    texLoader.load('/assets/textures/about/scene/texMontagne.png', (texture) => {
      const geo = new THREE.PlaneGeometry(24, 12);
      const mat = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.85,
        depthWrite: false,
      });
      this.mountainMesh = new THREE.Mesh(geo, mat);
      this.mountainMesh.position.set(0, 2, -10);
      this.add(this.mountainMesh);
    });
  }

  private loadModels() {
    const loader = new GLTFLoader();

    // Main about landscape
    loader.load(
      '/assets/models/about/scene_v15.glb',
      (gltf) => {
        this.model = gltf.scene;
        this.model.position.set(0, -2, 0);
        this.model.scale.set(1.1, 1.1, 1.1);
        this.add(this.model);
      },
      undefined,
      (err) => console.warn('About scene load warning:', err)
    );

    // Flower
    loader.load(
      '/assets/models/global/flower/flower_v2.glb',
      (gltf) => {
        this.flower = gltf.scene;
        this.flower.position.set(1.5, 0, 1);
        this.flower.scale.set(0.6, 0.6, 0.6);
        this.add(this.flower);
      },
      undefined,
      (err) => console.warn('Flower load warning:', err)
    );
  }

  public update(time: number, scrollY: number) {
    if (!this.visible) return;

    if (this.flower) {
      this.flower.rotation.y = Math.sin(time * 0.4) * 0.2;
      this.flower.rotation.z = Math.cos(time * 0.3) * 0.1;
    }

    if (this.mountainMesh) {
      this.mountainMesh.position.y = 2 + scrollY * 0.0004;
    }
  }
}
