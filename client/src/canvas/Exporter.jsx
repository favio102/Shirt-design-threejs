import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import {
  registerExportHandler,
  registerExportViewsHandler,
} from "../config/helpers";

const TARGET_LONGEST_SIDE = 2048;

const Exporter = () => {
  const { gl, scene, camera } = useThree();

  useEffect(() => {
    return registerExportHandler(() => {
      const originalSize = gl.getSize(new THREE.Vector2());
      const originalPixelRatio = gl.getPixelRatio();
      const aspect = originalSize.x / originalSize.y;
      const targetW =
        aspect >= 1 ? TARGET_LONGEST_SIDE : Math.round(TARGET_LONGEST_SIDE * aspect);
      const targetH =
        aspect >= 1 ? Math.round(TARGET_LONGEST_SIDE / aspect) : TARGET_LONGEST_SIDE;

      gl.setPixelRatio(1);
      gl.setSize(targetW, targetH, false);
      gl.render(scene, camera);
      const dataURL = gl.domElement.toDataURL("image/png");

      gl.setPixelRatio(originalPixelRatio);
      gl.setSize(originalSize.x, originalSize.y, false);
      gl.render(scene, camera);

      return dataURL;
    });
  }, [gl, scene, camera]);

  useEffect(() => {
    return registerExportViewsHandler(() => {
      const cell = 1024;
      const compositeW = cell * 2;
      const compositeH = cell * 2;

      const composite = document.createElement("canvas");
      composite.width = compositeW;
      composite.height = compositeH;
      const ctx = composite.getContext("2d");

      // Snap the camera rig to identity so views are angle-accurate.
      const cameraRig = scene.getObjectByName("camera-rig");
      const origRotation = cameraRig
        ? cameraRig.rotation.clone()
        : null;
      if (cameraRig) cameraRig.rotation.set(0, 0, 0);

      const originalSize = gl.getSize(new THREE.Vector2());
      const originalPR = gl.getPixelRatio();
      gl.setPixelRatio(1);
      gl.setSize(cell, cell, false);

      const tempCam = new THREE.PerspectiveCamera(25, 1, 0.1, 100);
      const dist = 2;

      const views = [
        { pos: [0, 0, dist], offset: [0, 0] },        // front
        { pos: [dist, 0, 0], offset: [cell, 0] },     // right
        { pos: [-dist, 0, 0], offset: [0, cell] },    // left
        { pos: [0, 0, -dist], offset: [cell, cell] }, // back
      ];

      for (const v of views) {
        tempCam.position.set(...v.pos);
        tempCam.lookAt(0, 0, 0);
        gl.render(scene, tempCam);
        ctx.drawImage(gl.domElement, v.offset[0], v.offset[1], cell, cell);
      }

      // Restore renderer + scene state.
      gl.setPixelRatio(originalPR);
      gl.setSize(originalSize.x, originalSize.y, false);
      if (cameraRig && origRotation) cameraRig.rotation.copy(origRotation);
      gl.render(scene, camera);

      return composite.toDataURL("image/png");
    });
  }, [gl, scene, camera]);

  return null;
};

export default Exporter;
