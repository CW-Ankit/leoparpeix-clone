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

  // Constrained Hero zone coordinates (from original site: xRange: 3, yRange: 0.65, zRange: 1.5, zTarget: 0.3)
  private heroOrigin: THREE.Vector3 = new THREE.Vector3(1.2, 0.4, 0.3);
  private currentPos: THREE.Vector3 = new THREE.Vector3(1.2, 0.4, 0.3);
  private currentVelocity: THREE.Vector3 = new THREE.Vector3(0, 0, 0);

  // Autonomous wandering target
  private wanderTarget: THREE.Vector3 = new THREE.Vector3(1.2, 0.4, 0.3);
  private lastWanderChange: number = 0;

  // Active pursue target (fruit)
  private pursueTarget: THREE.Vector3 | null = null;

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
    const ambient = new THREE.AmbientLight(0xffffff, 2.2);
    this.add(ambient);

    const dir = new THREE.DirectionalLight(0xfffaed, 3.0);
    dir.position.set(4, 6, 8);
    this.add(dir);
  }

  private loadBee() {
    const loader = new GLTFLoader();
    loader.load('/assets/models/global/bee/bee_v4.glb', (gltf) => {
      this.bee = gltf.scene;
      this.bee.scale.set(0.18, 0.18, 0.18);
      this.bee.position.copy(this.heroOrigin);

      // Find wings for rapid flapping animation
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
      this.orangeTemplate.scale.set(0.15, 0.15, 0.15);
    });

    loader.load('/assets/models/global/fruits/raisin.glb', (gltf) => {
      this.raisinTemplate = gltf.scene;
      this.raisinTemplate.scale.set(0.15, 0.15, 0.15);
    });
  }

  public spawnFruitAt(clientX: number, clientY: number) {
    const template = Math.random() > 0.5 ? this.orangeTemplate : this.raisinTemplate;
    if (!template) return;

    const fruit = template.clone();

    // Convert 2D screen click to 3D world space
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
      velocity: new THREE.Vector3((Math.random() - 0.5) * 0.02, 0.04, 0),
      isConsumed: false,
    });
  }

  public update(time: number, dt: number = 0.016) {
    // 1. Falling Fruits Physics & Bee Consumption
    for (let i = this.activeFruits.length - 1; i >= 0; i--) {
      const f = this.activeFruits[i];
      f.velocity.y -= 0.0035; // gravity
      f.mesh.position.add(f.velocity);
      f.mesh.rotation.x += 0.05;
      f.mesh.rotation.y += 0.06;

      // Bee eating detection
      if (this.bee && !f.isConsumed) {
        const dist = this.bee.position.distanceTo(f.mesh.position);
        if (dist < 0.65) {
          f.isConsumed = true;
          eventBus.emit(EVENTS.FEED_BEE);

          // Pop animation
          f.mesh.scale.set(0.001, 0.001, 0.001);
          setTimeout(() => {
            this.remove(f.mesh);
            const idx = this.activeFruits.indexOf(f);
            if (idx !== -1) this.activeFruits.splice(idx, 1);
          }, 60);
        }
      }

      // Remove fruits falling out of view
      if (f.mesh.position.y < -8) {
        this.remove(f.mesh);
        this.activeFruits.splice(i, 1);
      }
    }

    // 2. Autonomous Bee Flight & Fruit Pursuing
    if (this.bee) {
      if (this.activeFruits.length > 0) {
        // High speed pursuit mode when fruit is present!
        const nearestFruit = this.activeFruits[0];
        this.pursueTarget = nearestFruit.mesh.position;
      } else {
        this.pursueTarget = null;
      }

      if (this.pursueTarget) {
        // Fly directly toward the fruit
        const toFruit = this.pursueTarget.clone().sub(this.currentPos);
        this.currentVelocity.lerp(toFruit.multiplyScalar(0.12), 0.15);
      } else {
        // Natural gentle hovering within the Hero range:
        // Update wander target every ~2.5 seconds
        if (time - this.lastWanderChange > 2.5) {
          this.lastWanderChange = time;
          this.wanderTarget.set(
            this.heroOrigin.x + (Math.random() - 0.5) * 2.5,
            this.heroOrigin.y + (Math.random() - 0.5) * 0.8,
            this.heroOrigin.z + (Math.random() - 0.5) * 0.8
          );
        }

        // Steer towards wander target
        const steer = this.wanderTarget.clone().sub(this.currentPos);
        this.currentVelocity.lerp(steer.multiplyScalar(0.025), 0.06);
      }

      this.currentPos.add(this.currentVelocity);

      // Micro hover flutter
      const flutterY = Math.sin(time * 5.0) * 0.035;
      const flutterX = Math.cos(time * 3.5) * 0.02;

      this.bee.position.set(
        this.currentPos.x + flutterX,
        this.currentPos.y + flutterY,
        this.currentPos.z
      );

      // Banking rotation based on flight direction and speed
      const targetRotZ = -this.currentVelocity.x * 2.5;
      const targetRotY = this.currentVelocity.x * 3.0;
      const targetRotX = -this.currentVelocity.y * 2.0;

      this.bee.rotation.z = THREE.MathUtils.lerp(this.bee.rotation.z, targetRotZ, 0.1);
      this.bee.rotation.y = THREE.MathUtils.lerp(this.bee.rotation.y, targetRotY, 0.1);
      this.bee.rotation.x = THREE.MathUtils.lerp(this.bee.rotation.x, targetRotX, 0.1);

      // Flap wings rapidly
      this.wings.forEach((wing, idx) => {
        const sign = idx % 2 === 0 ? 1 : -1;
        wing.rotation.z = Math.sin(time * 42) * 0.5 * sign;
      });
    }
  }

  public resize(width: number, height: number) {
    this.width = width;
    this.height = height;
  }
}
