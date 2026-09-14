import * as THREE from 'three';
import { HomeScene } from './HomeScene';
import { AboutScene } from './AboutScene';
import { TopScene } from './TopScene';
import { FluidSimulation } from './FluidSimulation';
import { PostProcessing } from './PostProcessing';
import { eventBus, EVENTS } from '../services/EventBus';

export class WebGLManager {
  private static instance: WebGLManager;

  // Main Canvas & Renderer
  private mainCanvasContainer!: HTMLElement;
  private mainRenderer!: THREE.WebGLRenderer;
  private mainScene!: THREE.Scene;
  private homeScene!: HomeScene;
  private aboutScene!: AboutScene;

  // Camera Rig
  private modelCameraGroup!: THREE.Group;
  private mouseMoveCameraGroup!: THREE.Group;
  private perspectiveCamera!: THREE.PerspectiveCamera;

  // Top Canvas & Renderer (Bee / Interactive Layer)
  private topCanvasContainer!: HTMLElement;
  private topRenderer!: THREE.WebGLRenderer;
  private topCamera!: THREE.PerspectiveCamera;
  private topScene!: TopScene;

  // Fluid & Post-Processing
  private fluidSimulation!: FluidSimulation;
  private postProcessing!: PostProcessing;

  // State
  private width: number = window.innerWidth;
  private height: number = window.innerHeight;
  private mouseTarget: THREE.Vector2 = new THREE.Vector2(0, 0);
  private mouseCurrent: THREE.Vector2 = new THREE.Vector2(0, 0);
  private scrollY: number = 0;
  private maxScroll: number = 1;
  private activeRoute: string = 'home';
  private clock: THREE.Clock = new THREE.Clock();
  private isRunning: boolean = false;

  public static getInstance(): WebGLManager {
    if (!WebGLManager.instance) {
      WebGLManager.instance = new WebGLManager();
    }
    return WebGLManager.instance;
  }

  public init(
    mainContainer: HTMLElement,
    topContainer: HTMLElement
  ) {
    this.mainCanvasContainer = mainContainer;
    this.topCanvasContainer = topContainer;
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.setupMainRenderer();
    this.setupTopRenderer();
    this.setupEvents();
    this.start();
  }

  private setupMainRenderer() {
    this.mainRenderer = new THREE.WebGLRenderer({
      powerPreference: 'high-performance',
      antialias: false,
      alpha: true,
    });
    this.mainRenderer.setSize(this.width, this.height);
    this.mainRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.mainRenderer.outputColorSpace = THREE.SRGBColorSpace;
    this.mainCanvasContainer.appendChild(this.mainRenderer.domElement);

    this.mainScene = new THREE.Scene();

    // Camera Rig: modelCameraGroup -> mouseMoveCameraGroup -> perspectiveCamera
    this.modelCameraGroup = new THREE.Group();
    this.mouseMoveCameraGroup = new THREE.Group();

    // Authentic FOV and Camera position from leoparpeix.com
    this.perspectiveCamera = new THREE.PerspectiveCamera(40, this.width / this.height, 0.1, 150);
    this.perspectiveCamera.position.set(0, 2.4, 4.0);

    this.mouseMoveCameraGroup.add(this.perspectiveCamera);
    this.modelCameraGroup.add(this.mouseMoveCameraGroup);
    this.mainScene.add(this.modelCameraGroup);

    // Scenes
    this.homeScene = new HomeScene();
    this.aboutScene = new AboutScene();
    this.aboutScene.visible = false;

    this.mainScene.add(this.homeScene);
    this.mainScene.add(this.aboutScene);

    // Fluid & Post-Processing
    this.fluidSimulation = new FluidSimulation(this.mainRenderer, this.width, this.height);
    this.postProcessing = new PostProcessing(this.mainRenderer, this.width, this.height);
  }

  private setupTopRenderer() {
    this.topRenderer = new THREE.WebGLRenderer({
      powerPreference: 'high-performance',
      antialias: true,
      alpha: true,
    });
    this.topRenderer.setSize(this.width, this.height);
    this.topRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.topCanvasContainer.appendChild(this.topRenderer.domElement);

    this.topCamera = new THREE.PerspectiveCamera(40, this.width / this.height, 0.1, 100);
    this.topCamera.position.set(0, 0, 7);

    this.topScene = new TopScene(this.topCamera, this.width, this.height);
  }

  private setupEvents() {
    window.addEventListener('resize', () => this.onResize());

    window.addEventListener('pointermove', (e: MouseEvent) => {
      this.mouseTarget.x = (e.clientX / this.width) * 2 - 1;
      this.mouseTarget.y = -(e.clientY / this.height) * 2 + 1;

      // Feed kinetic disturbance to Fluid Simulation
      this.fluidSimulation?.onPointerMove(e.clientX, e.clientY);
    });

    // Click in hero section or on "(Click to feed the bee)" feeds the bee
    window.addEventListener('click', (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, input, .video-modal, .navbar-block, .project-slider')) return;

      // Only spawn fruit in top/hero zone
      if (e.clientY < window.innerHeight * 0.9) {
        this.topScene?.spawnFruitAt(e.clientX, e.clientY);
      }
    });

    eventBus.on(EVENTS.SCROLL, (e: any) => {
      this.scrollY = e.animatedScroll ?? window.scrollY;
      this.maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    });
  }

  public setRoute(route: string) {
    this.activeRoute = route;
    if (this.homeScene && this.aboutScene) {
      this.homeScene.visible = route === 'home';
      this.aboutScene.visible = route === 'about';

      if (route === 'about') {
        this.perspectiveCamera.position.set(0, 1.89, 6.9);
        this.perspectiveCamera.rotation.set(-0.1, 0, 0);
      } else {
        this.perspectiveCamera.position.set(0, 2.4, 4.0);
        this.perspectiveCamera.rotation.set(0, 0, 0);
      }
    }
  }

  private onResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    const aspect = this.width / this.height;

    this.perspectiveCamera.aspect = aspect;
    this.perspectiveCamera.updateProjectionMatrix();

    this.topCamera.aspect = aspect;
    this.topCamera.updateProjectionMatrix();

    this.mainRenderer.setSize(this.width, this.height);
    this.topRenderer.setSize(this.width, this.height);

    this.postProcessing.resize(this.width, this.height);
    this.fluidSimulation.resize(this.width, this.height);
    this.topScene.resize(this.width, this.height);
  }

  public start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.animate();
  }

  private animate = () => {
    if (!this.isRunning) return;
    requestAnimationFrame(this.animate);

    const dt = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    // 1. Subtle mouse parallax lerp
    this.mouseCurrent.lerp(this.mouseTarget, 0.05);
    this.mouseMoveCameraGroup.position.x = this.mouseCurrent.x * 0.25;
    this.mouseMoveCameraGroup.position.y = this.mouseCurrent.y * 0.15;
    this.mouseMoveCameraGroup.rotation.y = -this.mouseCurrent.x * 0.02;
    this.mouseMoveCameraGroup.rotation.x = this.mouseCurrent.y * 0.02;

    // 2. Scroll-based Camera Rig Interpolation
    const scrollRatio = Math.min(1, Math.max(0, this.scrollY / this.maxScroll));

    if (this.activeRoute === 'home') {
      // Moves seamlessly through the room as the user scrolls
      const targetY = 2.4 - scrollRatio * 3.2;
      const targetZ = 4.0 - scrollRatio * 2.8;
      this.modelCameraGroup.position.y = THREE.MathUtils.lerp(this.modelCameraGroup.position.y, targetY, 0.06);
      this.modelCameraGroup.position.z = THREE.MathUtils.lerp(this.modelCameraGroup.position.z, targetZ, 0.06);
    }

    // 3. Update Scene Animations
    this.homeScene?.update(elapsedTime, this.scrollY);
    this.aboutScene?.update(elapsedTime, this.scrollY);
    this.topScene?.update(elapsedTime, dt);

    // 4. Update GPU Fluid Simulation
    this.fluidSimulation?.update(dt);

    // 5. Render Main 3D Scene into PostProcessing FBO
    this.mainRenderer.setRenderTarget(this.postProcessing.target);
    this.mainRenderer.render(this.mainScene, this.perspectiveCamera);

    // 6. Post-process with Fluid Distortion to Screen
    this.postProcessing.render(this.fluidSimulation.velocityTexture);

    // 7. Render Top Overlay (Interactive Bee & Fruits in Hero)
    this.topRenderer.render(this.topScene, this.topCamera);
  };
}

export const webglManager = WebGLManager.getInstance();
