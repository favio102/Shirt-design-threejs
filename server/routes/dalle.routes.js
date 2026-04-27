import express from "express";
import rateLimit from "express-rate-limit";
import logger from "../utils/logger.js";

const dalleRouter = express.Router();

const aiLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX) || 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many image generation requests — please slow down.",
    code: "rate_limit_exceeded",
  },
});

dalleRouter.route("/").get((req, res) => {
  res.status(200).json({ message: "Hello from image generation router" });
});

dalleRouter.route("/").post(aiLimiter, async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ message: "Prompt is required." });
    }

    const seed = Math.floor(Math.random() * 1_000_000);
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(
      prompt
    )}?width=1024&height=1024&nologo=true&model=flux&seed=${seed}`;

    const upstream = await fetch(url);
    if (!upstream.ok) {
      return res.status(upstream.status).json({
        message: `Image service returned ${upstream.status}`,
        code: "upstream_error",
      });
    }

    const buffer = Buffer.from(await upstream.arrayBuffer());
    const image = buffer.toString("base64");
    res.status(200).json({ photo: image });
  } catch (error) {
    logger.error({ err: error }, "image generation failed");
    res.status(500).json({ message: "Image generation failed." });
  }
});

export { dalleRouter };
