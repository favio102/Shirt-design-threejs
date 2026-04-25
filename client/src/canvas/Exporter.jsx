import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { registerExportHandler } from "../config/helpers";

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

  return null;
};

export default Exporter;
