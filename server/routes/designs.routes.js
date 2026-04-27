import express from "express";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import Design from "../models/Design.js";
import {
  isDataUrl,
  uploadDataUrl,
  isCloudinaryConfigured,
} from "../utils/cloudinary.js";
import logger from "../utils/logger.js";

const designsRouter = express.Router();

// Designs payloads carry image data URLs (logos, full decals), so this route
// needs more headroom than the 1mb global default. Apply only here.
const jsonParser = express.json({ limit: "10mb" });

const designsLimiter = rateLimit({
  windowMs: Number(process.env.DESIGNS_RATE_LIMIT_WINDOW_MS) || 60 * 1000,
  max: Number(process.env.DESIGNS_RATE_LIMIT_MAX) || 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many design saves — please slow down.",
    code: "rate_limit_exceeded",
  },
});

const HEX_COLOR = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
const CLOUDINARY_HOST = "https://res.cloudinary.com/";
const MAX_LOGOS = 10;

const isAllowedMap = (value) =>
  typeof value === "string" &&
  (isDataUrl(value) || value.startsWith(CLOUDINARY_HOST));

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

designsRouter.post("/", designsLimiter, jsonParser, async (req, res) => {
  try {
    const { color, isLogoTexture, isFullTexture, fullDecal } = req.body;
    const logos = normalizeLogos(req.body);

    if (!color || !fullDecal) {
      return res
        .status(400)
        .json({ message: "Missing required fields: color, fullDecal." });
    }

    if (typeof color !== "string" || !HEX_COLOR.test(color)) {
      return res.status(400).json({
        message: "Invalid color: expected hex like #RRGGBB or #RGB.",
      });
    }

    if (logos.length > MAX_LOGOS) {
      return res
        .status(400)
        .json({ message: `Too many logos (max ${MAX_LOGOS}).` });
    }

    if (!isAllowedMap(fullDecal) || !logos.every((l) => isAllowedMap(l.map))) {
      return res.status(400).json({
        message:
          "Decal map must be a data URL or a Cloudinary https URL.",
        code: "invalid_decal_url",
      });
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
    res.status(500).json({ message: "Failed to save design." });
  }
});

designsRouter.get("/:id", async (req, res) => {
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
    res.status(500).json({ message: "Failed to load design." });
  }
});

export { designsRouter };
