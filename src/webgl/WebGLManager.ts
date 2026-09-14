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
    this.perspectiveCamera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 100);
    this.perspectiveCamera.position.set(0, 0, 7.5);

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

    this.topCamera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 100);
    this.topCamera.position.set(0, 0, 8);

    this.topScene = new TopScene(this.topCamera, this.width, this.height);
  }

  private setupEvents() {
    window.addEventListener('resize', () => this.onResize());

    window.addEventListener('pointermove', (e: MouseEvent) => {
      // Mouse Parallax Targets [-1, 1]
      this.mouseTarget.x = (e.clientX / this.width) * 2 - 1;
      this.mouseTarget.y = -(e.clientY / this.height) * 2 + 1;

      // Pass to TopScene (Bee tracker)
      this.topScene?.setPointerPosition(e.clientX, e.clientY);

      // Pass to Fluid Simulation
      this.fluidSimulation?.onPointerMove(e.clientX, e.clientY);
    });

    // Click anywhere spawns fruit for the bee!
    window.addEventListener('click', (e: MouseEvent) => {
      // Don't spawn if clicking links, buttons, or video player
      const target = e.target as HTMLElement;
      if (target.closest('a, button, input, .video-modal, .navbar-block')) return;

      this.topScene?.spawnFruitAt(e.clientX, e.clientY);
    });

    eventBus.on(EVENTS.SCROLL, (e: any) => {
      this.scrollY = e.animatedScroll ?? window.scrollY;
    });
  }

  public setRoute(route: string) {
    this.activeRoute = route;
    if (this.homeScene && this.aboutScene) {
      this.homeScene.visible = route === 'home';
      this.aboutScene.visible = route === 'about';
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

    // 1. Smooth mouse parallax lerp
    this.mouseCurrent.lerp(this.mouseTarget, 0.05);
    this.mouseMoveCameraGroup.position.x = this.mouseCurrent.x * 0.4;
    this.mouseMoveCameraGroup.position.y = this.mouseCurrent.y * 0.3;
    this.mouseMoveCameraGroup.rotation.y = -this.mouseCurrent.x * 0.04;
    this.mouseMoveCameraGroup.rotation.x = this.mouseCurrent.y * 0.04;

    // 2. Scroll Camera Motion
    const targetCamY = -this.scrollY * 0.0018;
    this.modelCameraGroup.position.y = THREE.MathUtils.lerp(
      this.modelCameraGroup.position.y,
      targetCamY,
      0.08
    );

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

    // 7. Render Top Overlay (Interactive Bee & Fruits)
    this.topRenderer.render(this.topScene, this.topCamera);
  };
}

export const webglManager = WebGLManager.getInstance();
