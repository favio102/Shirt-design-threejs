export const downloadCanvasToImage = () => {
  const canvas = document.querySelector("canvas");
  const dataURL = canvas.toDataURL();
  const link = document.createElement("a");

  link.href = dataURL;
  link.download = "canvas.png";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const reader = (file) =>
  new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = () => resolve(fileReader.result);
    fileReader.readAsDataURL(file);
  });

export const renderTextToDataURL = ({ text, font = "Arial", color = "#000000" }) => {
  const canvas = document.createElement("canvas");
  const size = 1024;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const family = `"${font}", sans-serif`;
  let fontSize = 240;
  ctx.font = `bold ${fontSize}px ${family}`;
  while (ctx.measureText(text).width > size * 0.9 && fontSize > 24) {
    fontSize -= 8;
    ctx.font = `bold ${fontSize}px ${family}`;
  }

  ctx.fillText(text, size / 2, size / 2);
  return canvas.toDataURL("image/png");
};

export const getContrastingColor = (color) => {
  // Remove the '#' character if it exists
  const hex = color.replace("#", "");

  // Convert the hex string to RGB values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Calculate the brightness of the color
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  // Return black or white depending on the brightness
  return brightness > 128 ? "black" : "white";
};
