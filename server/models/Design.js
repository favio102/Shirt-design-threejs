import mongoose from "mongoose";

const LogoSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    map: { type: String, required: true },
    position: { type: [Number], default: [0, 0.04, 0.15] },
    rotation: { type: [Number], default: [0, 0, 0] },
    scale: { type: Number, default: 0.15 },
  },
  { _id: false }
);

const DesignSchema = new mongoose.Schema(
  {
    color: { type: String, required: true },
    isLogoTexture: { type: Boolean, default: true },
    isFullTexture: { type: Boolean, default: false },
    logos: { type: [LogoSchema], default: [] },
    fullDecal: { type: String, required: true },
  },
  { timestamps: true }
);

const Design = mongoose.model("Design", DesignSchema);

export default Design;
