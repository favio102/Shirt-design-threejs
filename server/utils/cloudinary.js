import { v2 as cloudinary } from "cloudinary";

const hasCredentials =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

if (hasCredentials) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export const isCloudinaryConfigured = () => hasCredentials;

export const isDataUrl = (s) => typeof s === "string" && s.startsWith("data:");

export const uploadDataUrl = async (dataUrl, folder = "shirt-designs") => {
  if (!hasCredentials) {
    throw new Error("Cloudinary credentials are not configured on the server.");
  }
  const result = await cloudinary.uploader.upload(dataUrl, {
    folder,
    resource_type: "image",
  });
  return result.secure_url;
};
