import express from "express";
import * as dotenv from "dotenv";
import OpenAI from 'openai';
import rateLimit from "express-rate-limit";
import logger from "../utils/logger.js";

dotenv.config();
const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

router.route("/").get((req, res) => {
  res.status(200).json({ message: "Hello from DALL. E Router" });
});

router.route("/").post(aiLimiter, async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await openai.images.generate({
      model: "gpt-image-1",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });
    const image = response.data[0].b64_json;
    res.status(200).json({ photo: image });
  } catch (error) {
    logger.error({ err: error }, "DALL·E generation failed");
    const status = error?.status ?? 500;
    res.status(status).json({
      message: error?.message ?? "Something went wrong",
      code: error?.code,
      type: error?.type,
    });
  }
});

export default router;
