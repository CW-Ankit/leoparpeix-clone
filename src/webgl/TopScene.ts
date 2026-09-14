import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { eventBus, EVENTS } from '../services/EventBus';

interface FruitEntity {
  mesh: THREE.Group;
  velocity: THREE.Vector3;
  isConsumed: boolean;
}

export class TopScene extends THREE.Scene {
  private bee: THREE.Group | null = null;
  private wings: THREE.Mesh[] = [];
  private orangeTemplate: THREE.Group | null = null;
  private raisinTemplate: THREE.Group | null = null;

  private activeFruits: FruitEntity[] = [];
  private targetPosition: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  private currentPosition: THREE.Vector3 = new THREE.Vector3(0, 0, 0);

  private camera: THREE.PerspectiveCamera;
  private width: number;
  private height: number;

  constructor(camera: THREE.PerspectiveCamera, width: number, height: number) {
    super();
    this.camera = camera;
    this.width = width;
    this.height = height;

    this.setupLighting();
    this.loadBee();
    this.loadFruitTemplates();
  }

  private setupLighting() {
    const ambient = new THREE.AmbientLight(0xffffff, 1.8);
    this.add(ambient);

    const dir = new THREE.DirectionalLight(0xfffaed, 2.5);
    dir.position.set(4, 6, 8);
    this.add(dir);
  }

  private loadBee() {
    const loader = new GLTFLoader();
    loader.load('/assets/models/global/bee/bee_v4.glb', (gltf) => {
      this.bee = gltf.scene;
      this.bee.scale.set(0.18, 0.18, 0.18);
      this.bee.position.set(0, 0, 0);

      // Find wings for flapping animation
      this.bee.traverse((child) => {
        if ((child as THREE.Mesh).isMesh && child.name.toLowerCase().includes('wing')) {
          this.wings.push(child as THREE.Mesh);
        }
      });

      this.add(this.bee);
    });
  }

  private loadFruitTemplates() {
    const loader = new GLTFLoader();

    loader.load('/assets/models/global/fruits/orange.glb', (gltf) => {
      this.orangeTemplate = gltf.scene;
      this.orangeTemplate.scale.set(0.14, 0.14, 0.14);
    });

    loader.load('/assets/models/global/fruits/raisin.glb', (gltf) => {
      this.raisinTemplate = gltf.scene;
      this.raisinTemplate.scale.set(0.14, 0.14, 0.14);
    });
  }

  public setPointerPosition(clientX: number, clientY: number) {
    // Project 2D screen coords to 3D world space plane at z = 0
    const normX = (clientX / this.width) * 2 - 1;
    const normY = -(clientY / this.height) * 2 + 1;

    const vec = new THREE.Vector3(normX, normY, 0.5);
    vec.unproject(this.camera);
    vec.sub(this.camera.position).normalize();

    const distance = -this.camera.position.z / vec.z;
    const pos = this.camera.position.clone().add(vec.multiplyScalar(distance));

    // Offset slightly so bee hovers near cursor
    pos.x += 0.3;
    pos.y += 0.3;
    this.targetPosition.copy(pos);
  }

  public spawnFruitAt(clientX: number, clientY: number) {
    const template = Math.random() > 0.5 ? this.orangeTemplate : this.raisinTemplate;
    if (!template) return;

    const fruit = template.clone();

    // Calculate spawn position in 3D
    const normX = (clientX / this.width) * 2 - 1;
    const normY = -(clientY / this.height) * 2 + 1;
    const vec = new THREE.Vector3(normX, normY, 0.5);
    vec.unproject(this.camera);
    vec.sub(this.camera.position).normalize();
    const distance = -this.camera.position.z / vec.z;
    const pos = this.camera.position.clone().add(vec.multiplyScalar(distance));

    fruit.position.copy(pos);
    this.add(fruit);

    this.activeFruits.push({
      mesh: fruit,
      velocity: new THREE.Vector3((Math.random() - 0.5) * 0.02, 0.05, 0),
      isConsumed: false,
    });
  }

  public update(time: number, dt: number = 0.016) {
    // 1. Update Falling Fruits
    for (let i = this.activeFruits.length - 1; i >= 0; i--) {
      const f = this.activeFruits[i];
      f.velocity.y -= 0.003; // gravity
      f.mesh.position.add(f.velocity);
      f.mesh.rotation.x += 0.04;
      f.mesh.rotation.y += 0.05;

      // Bee eating interaction
      if (this.bee && !f.isConsumed) {
        const dist = this.bee.position.distanceTo(f.mesh.position);
        if (dist < 0.6) {
          f.isConsumed = true;
          eventBus.emit(EVENTS.FEED_BEE);

          // Pop animation
          f.mesh.scale.set(0.001, 0.001, 0.001);
          setTimeout(() => {
            this.remove(f.mesh);
            const idx = this.activeFruits.indexOf(f);
            if (idx !== -1) this.activeFruits.splice(idx, 1);
          }, 50);
        }
      }

      // Remove fruits that fall out of view
      if (f.mesh.position.y < -10) {
        this.remove(f.mesh);
        this.activeFruits.splice(i, 1);
      }
    }

    // 2. Animate Bee Movement
    if (this.bee) {
      // If there's an active fruit, target it!
      let target = this.targetPosition;
      if (this.activeFruits.length > 0) {
        const nearestFruit = this.activeFruits[0];
        target = nearestFruit.mesh.position;
      }

      // Smooth lerp towards target
      const lerpFactor = this.activeFruits.length > 0 ? 0.08 : 0.04;
      this.currentPosition.lerp(target, lerpFactor);

      // Idle float offset
      const hoverY = Math.sin(time * 3.5) * 0.08;
      const hoverX = Math.cos(time * 2.2) * 0.05;

      this.bee.position.set(
        this.currentPosition.x + hoverX,
        this.currentPosition.y + hoverY,
        this.currentPosition.z
      );

      // Banking angle based on horizontal movement
      const diffX = target.x - this.bee.position.x;
      const diffY = target.y - this.bee.position.y;
      this.bee.rotation.z = -diffX * 0.35;
      this.bee.rotation.y = diffX * 0.45;
      this.bee.rotation.x = -diffY * 0.25;

      // Flutter wings rapidly
      this.wings.forEach((wing, idx) => {
        const sign = idx % 2 === 0 ? 1 : -1;
        wing.rotation.z = Math.sin(time * 38) * 0.45 * sign;
      });
    }
  }

  public resize(width: number, height: number) {
    this.width = width;
    this.height = height;
  }
}
