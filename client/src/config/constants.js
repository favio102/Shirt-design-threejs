import {
  swatch,
  fileIcon,
  ai,
  logoShirt,
  stylishShirt,
  download,
  textIcon,
  layersIcon,
} from "../assets";

export const EditorTabs = [
  {
    name: "colorpicker",
    icon: swatch,
  },
  {
    name: "filepicker",
    icon: fileIcon,
  },
  {
    name: "aipicker",
    icon: ai,
  },
  {
    name: "textpicker",
    icon: textIcon,
  },
  {
    name: "decalmanager",
    icon: layersIcon,
  },
];

export const FilterTabs = [
  {
    name: "logoShirt",
    icon: logoShirt,
  },
  {
    name: "stylishShirt",
    icon: stylishShirt,
  },
  {
    name: "download",
    icon: download
  }
];

export const AIStyles = [
  {
    key: "vector",
    label: "Vector",
    modifier:
      "as a clean vector logo, flat design, bold simple shapes, solid colors",
  },
  {
    key: "watercolor",
    label: "Watercolor",
    modifier:
      "in a watercolor painting style, soft brushstrokes, vibrant colors",
  },
  {
    key: "vintage",
    label: "Vintage",
    modifier:
      "as a vintage badge design, distressed texture, retro typography",
  },
  {
    key: "pattern",
    label: "Pattern",
    modifier: "as a seamless repeating pattern, decorative texture",
  },
];

export const DecalTypes = {
  logo: {
    stateProperty: "logoDecal",
    filterTab: "logoShirt",
  },
  full: {
    stateProperty: "fullDecal",
    filterTab: "stylishShirt",
  },
};
