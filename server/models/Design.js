import mongoose from "mongoose";

const DesignSchema = new mongoose.Schema(
  {
    color: { type: String, required: true },
    isLogoTexture: { type: Boolean, default: true },
    isFullTexture: { type: Boolean, default: false },
    logoDecal: { type: String, required: true },
    fullDecal: { type: String, required: true },
  },
  { timestamps: true }
);

const Design = mongoose.model("Design", DesignSchema);

export default Design;
