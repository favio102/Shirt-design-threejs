import express from "express";
import mongoose from "mongoose";
import Design from "../models/Design.js";
import {
  isDataUrl,
  uploadDataUrl,
  isCloudinaryConfigured,
} from "../utils/cloudinary.js";
import logger from "../utils/logger.js";

const router = express.Router();

// Accept both the new (logos: []) shape and the legacy
// (logoDecal, logoPosition) single-logo shape, and normalize to logos[].
const normalizeLogos = (body) => {
  if (Array.isArray(body.logos)) return body.logos;
  if (body.logoDecal) {
    return [
      {
        id: "default",
        map: body.logoDecal,
        position: body.logoPosition || [0, 0.04, 0.15],
        rotation: [0, 0, 0],
        scale: 0.15,
      },
    ];
  }
  return [];
};

router.post("/", async (req, res) => {
  try {
    const { color, isLogoTexture, isFullTexture, fullDecal } = req.body;
    const logos = normalizeLogos(req.body);

    if (!color || !fullDecal) {
      return res
        .status(400)
        .json({ message: "Missing required fields: color, fullDecal." });
    }

    const anyLogoIsDataUrl = logos.some((l) => isDataUrl(l.map));
    const fullIsDataUrl = isDataUrl(fullDecal);

    if (!isCloudinaryConfigured() && (anyLogoIsDataUrl || fullIsDataUrl)) {
      return res.status(503).json({
        message:
          "Cloudinary credentials are not configured; cannot upload custom decal images.",
        code: "cloudinary_not_configured",
      });
    }

    const [uploadedLogos, fullUrl] = await Promise.all([
      Promise.all(
        logos.map(async (l) => ({
          ...l,
          map: isDataUrl(l.map) ? await uploadDataUrl(l.map) : l.map,
        }))
      ),
      isDataUrl(fullDecal) ? uploadDataUrl(fullDecal) : fullDecal,
    ]);

    const design = await Design.create({
      color,
      isLogoTexture: !!isLogoTexture,
      isFullTexture: !!isFullTexture,
      logos: uploadedLogos,
      fullDecal: fullUrl,
    });

    res.status(201).json({ id: design._id });
  } catch (error) {
    logger.error({ err: error }, "designs route error");
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
      logos: design.logos,
      fullDecal: design.fullDecal,
    });
  } catch (error) {
    logger.error({ err: error }, "designs route error");
    res.status(500).json({
      message: error?.message || "Failed to load design.",
    });
  }
});

export default router;
