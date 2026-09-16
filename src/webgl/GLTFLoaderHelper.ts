import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

let sharedLoader: GLTFLoader | null = null;

export function getSharedGLTFLoader(): GLTFLoader {
  if (!sharedLoader) {
    sharedLoader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    // Path to Draco wasm/js decoder files in public/draco/gltf/
    dracoLoader.setDecoderPath('/draco/gltf/');
    sharedLoader.setDRACOLoader(dracoLoader);
  }
  return sharedLoader;
}
