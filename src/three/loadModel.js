import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const loader = new GLTFLoader();

/**
 * Loads a .glb/.gltf model. Not wired into the current scene — Ripped has
 * no 3D garment asset yet — but ready for when one exists: drop the file in
 * /public and call loadModel("/model.glb").
 *
 * If a future asset is Draco-compressed, add a DRACOLoader and call
 * loader.setDRACOLoader(dracoLoader) before use.
 */
export function loadModel(url, onProgress) {
  return new Promise((resolve, reject) => {
    loader.load(
      url,
      (gltf) => resolve(gltf),
      onProgress,
      (error) => reject(error)
    );
  });
}
