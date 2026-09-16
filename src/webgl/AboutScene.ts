import * as THREE from 'three';
import { getSharedGLTFLoader } from './GLTFLoaderHelper';

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
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.6);
    this.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfffaed, 2.4);
    dirLight.position.set(-32, 10, 18);
    this.add(dirLight);
  }

  private setupMountainBackground() {
    const texLoader = new THREE.TextureLoader();
    texLoader.load('/assets/textures/about/scene/texMontagne.png', (texture) => {
      const geo = new THREE.PlaneGeometry(35, 18);
      const mat = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.85,
        depthWrite: false,
      });
      this.mountainMesh = new THREE.Mesh(geo, mat);
      this.mountainMesh.position.set(0, 3, -16);
      this.add(this.mountainMesh);
    });
  }

  private loadModels() {
    const loader = getSharedGLTFLoader();

    // Main about landscape
    loader.load(
      '/assets/models/about/scene_v15.glb',
      (gltf) => {
        this.model = gltf.scene;
        this.model.position.set(0, 0, 0);
        this.model.scale.set(1.0, 1.0, 1.0);
        this.add(this.model);
      },
      undefined,
      (err) => console.warn('About scene warning:', err)
    );

    // Flower
    loader.load(
      '/assets/models/global/flower/flower_v2.glb',
      (gltf) => {
        this.flower = gltf.scene;
        this.flower.position.set(1.2, 0.2, 2.0);
        this.flower.scale.set(0.7, 0.7, 0.7);
        this.add(this.flower);
      },
      undefined,
      (err) => console.warn('Flower warning:', err)
    );
  }

  public update(time: number, scrollY: number) {
    if (!this.visible) return;

    if (this.flower) {
      this.flower.rotation.y = Math.sin(time * 0.3) * 0.15;
    }

    if (this.mountainMesh) {
      this.mountainMesh.position.y = 3 + scrollY * 0.0003;
    }
  }
}
