import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class HomeScene extends THREE.Group {
  private model: THREE.Group | null = null;
  private clouds: THREE.Mesh[] = [];
  private isVisible: boolean = true;

  constructor() {
    super();
    this.setupLighting();
    this.setupClouds();
    this.loadModel();
  }

  private setupLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    this.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfffaed, 2.0);
    dirLight.position.set(5, 10, 7);
    this.add(dirLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x083d2a, 0.6);
    this.add(hemiLight);
  }

  private setupClouds() {
    const textureLoader = new THREE.TextureLoader();
    const cloudTextures = [1, 2, 3, 4, 5, 6].map(i =>
      textureLoader.load(`/assets/textures/global/clouds/cloud${i}.png`)
    );

    for (let i = 0; i < 8; i++) {
      const tex = cloudTextures[i % cloudTextures.length];
      const mat = new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        opacity: 0.45,
        depthWrite: false,
      });

      const plane = new THREE.Mesh(new THREE.PlaneGeometry(6, 3), mat);
      plane.position.set(
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 6 + 2,
        (Math.random() - 0.5) * 8 - 4
      );
      this.clouds.push(plane);
      this.add(plane);
    }
  }

  private loadModel() {
    const loader = new GLTFLoader();
    loader.load(
      '/assets/models/home/scene_v9.glb',
      (gltf) => {
        this.model = gltf.scene;
        this.model.position.set(0, -1.5, 0);
        this.model.scale.set(1.2, 1.2, 1.2);

        this.model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        this.add(this.model);
      },
      undefined,
      (err) => {
        console.warn('Home model load warning:', err);
      }
    );
  }

  public update(time: number, scrollY: number) {
    if (!this.visible) return;

    if (this.model) {
      this.model.rotation.y = Math.sin(time * 0.15) * 0.08 + scrollY * 0.0003;
    }

    // Drift clouds gently
    this.clouds.forEach((cloud, idx) => {
      cloud.position.x += Math.sin(time * 0.2 + idx) * 0.003;
    });
  }
}
