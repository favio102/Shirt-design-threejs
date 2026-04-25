import express from "express";
import mongoose from "mongoose";
import Design from "../models/Design.js";
import {
  isDataUrl,
  uploadDataUrl,
  isCloudinaryConfigured,
} from "../utils/cloudinary.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { color, isLogoTexture, isFullTexture, logoDecal, fullDecal } =
      req.body;

    if (!color || !logoDecal || !fullDecal) {
      return res
        .status(400)
        .json({ message: "Missing required fields: color, logoDecal, fullDecal." });
    }

    if (!isCloudinaryConfigured() && (isDataUrl(logoDecal) || isDataUrl(fullDecal))) {
      return res.status(503).json({
        message:
          "Cloudinary credentials are not configured; cannot upload custom decal images.",
        code: "cloudinary_not_configured",
      });
    }

    const [logoUrl, fullUrl] = await Promise.all([
      isDataUrl(logoDecal) ? uploadDataUrl(logoDecal) : logoDecal,
      isDataUrl(fullDecal) ? uploadDataUrl(fullDecal) : fullDecal,
    ]);

    const design = await Design.create({
      color,
      isLogoTexture: !!isLogoTexture,
      isFullTexture: !!isFullTexture,
      logoDecal: logoUrl,
      fullDecal: fullUrl,
    });

    res.status(201).json({ id: design._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error?.message || "Failed to save design.",
      code: error?.code,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid design ID." });
    }

    const design = await Design.findById(req.params.id);
    if (!design) {
      return res.status(404).json({ message: "Design not found." });
    }

    res.status(200).json({
      color: design.color,
      isLogoTexture: design.isLogoTexture,
      isFullTexture: design.isFullTexture,
      logoDecal: design.logoDecal,
      fullDecal: design.fullDecal,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error?.message || "Failed to load design.",
    });
  }
});

export default router;
