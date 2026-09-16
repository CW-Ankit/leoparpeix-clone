import * as THREE from 'three';
import { getSharedGLTFLoader } from './GLTFLoaderHelper';
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

  // Hero zone origin coordinates
  private heroOrigin: THREE.Vector3 = new THREE.Vector3(1.4, 0.2, 0.4);
  private currentPos: THREE.Vector3 = new THREE.Vector3(1.4, 0.2, 0.4);
  private currentVelocity: THREE.Vector3 = new THREE.Vector3(0, 0, 0);

  // Autonomous wandering
  private wanderTarget: THREE.Vector3 = new THREE.Vector3(1.4, 0.2, 0.4);
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

    this.updateHeroOrigin();
    this.currentPos.copy(this.heroOrigin);
    this.wanderTarget.copy(this.heroOrigin);

    this.setupLighting();
    this.loadBee();
    this.loadFruitTemplates();
  }

  private updateHeroOrigin() {
    const aspect = this.width / Math.max(1, this.height);
    // Visible half-width at z=0 for 40 deg FOV at distance 7:
    const visibleHalfWidth = 2.547 * aspect;

    if (aspect < 0.85) {
      // Mobile portrait: position in upper center area
      this.heroOrigin.set(
        Math.min(0.35, visibleHalfWidth * 0.35),
        0.55,
        0.4
      );
    } else if (aspect < 1.2) {
      // Tablet portrait/square:
      this.heroOrigin.set(
        Math.min(0.85, visibleHalfWidth * 0.5),
        0.35,
        0.4
      );
    } else {
      // Desktop landscape:
      this.heroOrigin.set(1.4, 0.2, 0.4);
    }
  }

  private setupLighting() {
    const ambient = new THREE.AmbientLight(0xffffff, 2.4);
    this.add(ambient);

    const dir = new THREE.DirectionalLight(0xfffaed, 3.2);
    dir.position.set(4, 8, 8);
    this.add(dir);
  }

  private loadBee() {
    const loader = getSharedGLTFLoader();
    loader.load('/assets/models/global/bee/bee_v4.glb', (gltf) => {
      this.bee = gltf.scene;

      // Authentic scale: 0.92 (prominent, highly visible, matching leoparpeix.com)
      this.bee.scale.set(0.92, 0.92, 0.92);
      this.bee.position.copy(this.heroOrigin);

      // Find wings for rapid flapping animation
      this.bee.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          child.castShadow = true;
          if (child.name.toLowerCase().includes('wing')) {
            this.wings.push(child as THREE.Mesh);
          }
        }
      });

      this.add(this.bee);
    });
  }

  private loadFruitTemplates() {
    const loader = getSharedGLTFLoader();

    loader.load('/assets/models/global/fruits/orange.glb', (gltf) => {
      this.orangeTemplate = gltf.scene;
      // Proportional fruit scale
      this.orangeTemplate.scale.set(0.65, 0.65, 0.65);
    });

    loader.load('/assets/models/global/fruits/raisin.glb', (gltf) => {
      this.raisinTemplate = gltf.scene;
      this.raisinTemplate.scale.set(0.65, 0.65, 0.65);
    });
  }

  public spawnFruitAt(clientX: number, clientY: number) {
    const template = Math.random() > 0.5 ? this.orangeTemplate : this.raisinTemplate;
    if (!template) return;

    const fruit = template.clone();

    // Convert screen coordinates to 3D world plane
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
      velocity: new THREE.Vector3((Math.random() - 0.5) * 0.02, 0.035, 0),
      isConsumed: false,
    });
  }

  public update(time: number, dt: number = 0.016) {
    // 1. Falling Fruits Physics & Bee Consumption
    for (let i = this.activeFruits.length - 1; i >= 0; i--) {
      const f = this.activeFruits[i];
      f.velocity.y -= 0.0035; // gravity
      f.mesh.position.add(f.velocity);
      f.mesh.rotation.x += 0.04;
      f.mesh.rotation.y += 0.05;

      // Bee eating detection (scaled to 1.1 distance)
      if (this.bee && !f.isConsumed) {
        const dist = this.bee.position.distanceTo(f.mesh.position);
        if (dist < 1.1) {
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

      // Remove fruits that fall out of screen
      if (f.mesh.position.y < -8) {
        this.remove(f.mesh);
        this.activeFruits.splice(i, 1);
      }
    }

    // 2. Autonomous Bee Flight & Fruit Pursuing
    if (this.bee) {
      if (this.activeFruits.length > 0) {
        // Pursuit mode when fruit is spawned
        const nearestFruit = this.activeFruits[0];
        this.pursueTarget = nearestFruit.mesh.position;
      } else {
        this.pursueTarget = null;
      }

      if (this.pursueTarget) {
        const toFruit = this.pursueTarget.clone().sub(this.currentPos);
        this.currentVelocity.lerp(toFruit.multiplyScalar(0.12), 0.15);
      } else {
        // Natural gentle wandering in Hero zone
        if (time - this.lastWanderChange > 2.5) {
          this.lastWanderChange = time;
          const aspect = this.width / Math.max(1, this.height);
          const spreadX = Math.min(2.0, Math.max(0.6, 2.0 * aspect));
          this.wanderTarget.set(
            this.heroOrigin.x + (Math.random() - 0.5) * spreadX,
            this.heroOrigin.y + (Math.random() - 0.5) * 0.6,
            this.heroOrigin.z + (Math.random() - 0.5) * 0.6
          );
        }

        const steer = this.wanderTarget.clone().sub(this.currentPos);
        this.currentVelocity.lerp(steer.multiplyScalar(0.025), 0.06);
      }

      this.currentPos.add(this.currentVelocity);

      // Micro hover flutter
      const flutterY = Math.sin(time * 4.5) * 0.05;
      const flutterX = Math.cos(time * 3.2) * 0.03;

      this.bee.position.set(
        this.currentPos.x + flutterX,
        this.currentPos.y + flutterY,
        this.currentPos.z
      );

      // Natural banking rotations
      const targetRotZ = -this.currentVelocity.x * 2.2;
      const targetRotY = this.currentVelocity.x * 2.8;
      const targetRotX = -this.currentVelocity.y * 1.8;

      this.bee.rotation.z = THREE.MathUtils.lerp(this.bee.rotation.z, targetRotZ, 0.1);
      this.bee.rotation.y = THREE.MathUtils.lerp(this.bee.rotation.y, targetRotY, 0.1);
      this.bee.rotation.x = THREE.MathUtils.lerp(this.bee.rotation.x, targetRotX, 0.1);

      // Rapid wing flutter
      this.wings.forEach((wing, idx) => {
        const sign = idx % 2 === 0 ? 1 : -1;
        wing.rotation.z = Math.sin(time * 40) * 0.55 * sign;
      });
    }
  }

  public resize(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.updateHeroOrigin();
  }
}
