import {
  swatch,
  fileIcon,
  ai,
  logoShirt,
  stylishShirt,
  download,
  textIcon,
  layersIcon,
  gridIcon,
} from "../assets";

export const EditorTabs = [
  {
    name: "colorpicker",
    label: "Pick a color",
    icon: swatch,
  },
  {
    name: "filepicker",
    label: "Upload image",
    icon: fileIcon,
  },
  {
    name: "aipicker",
    label: "Generate with AI",
    icon: ai,
  },
  {
    name: "textpicker",
    label: "Add text",
    icon: textIcon,
  },
  {
    name: "decalmanager",
    label: "Manage logos",
    icon: layersIcon,
  },
];

export const FilterTabs = [
  {
    name: "logoShirt",
    label: "Toggle logo decal",
    icon: logoShirt,
  },
  {
    name: "stylishShirt",
    label: "Toggle full pattern",
    icon: stylishShirt,
  },
  {
    name: "download",
    label: "Download PNG",
    icon: download
  },
  {
    name: "mockup",
    label: "Download mockup (four views)",
    icon: gridIcon
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
