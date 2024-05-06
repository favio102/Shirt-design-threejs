import { proxy } from "valtio";

const state = proxy({
  intro: true,
  color: "#EFBD48",
  isLogoTexture: true,
  isFullTexture: false,
  isDownload: false,
  logoDecal: "./lion.png",
  fullDecal: "./lion.png",
});

export default state;
