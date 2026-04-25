import ai from "./ai.png";
import fileIcon from "./file.png";
import swatch from "./swatch.png";
import download from "./download.png";

import logoShirt from "./logo-tshirt.png";
import stylishShirt from "./stylish-tshirt.png";

const textIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 7V4h14v3"/><path d="M9 20h6"/><path d="M12 4v16"/></svg>`;
const textIcon = `data:image/svg+xml;utf8,${encodeURIComponent(textIconSvg)}`;

const layersIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`;
const layersIcon = `data:image/svg+xml;utf8,${encodeURIComponent(layersIconSvg)}`;

const gridIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>`;
const gridIcon = `data:image/svg+xml;utf8,${encodeURIComponent(gridIconSvg)}`;

export {
  ai,
  fileIcon,
  swatch,
  download,
  logoShirt,
  stylishShirt,
  textIcon,
  layersIcon,
  gridIcon,
};
