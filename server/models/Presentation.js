import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { v2 as cloudinary } from "cloudinary";

const slideSchema = new mongoose.Schema({
  title: { type: String, required: [true, "Slide title is required"] },
  content: { type: [String], required: [true, "Slide content is required"] },
  speakerNotes: { type: String, default: "" },
  images: [
    {
      url: String,
      x: { type: String, default: "10%" },
      y: { type: String, default: "10%" },
      w: { type: String, default: "30%" },
      h: { type: String, default: "30%" },
      rotate: { type: Number, default: 0 },
      opacity: { type: Number, default: 1 },
    },
  ],
  layout: {
    type: String,
    enum: {
      values: ["default", "title_center", "split_left", "split_right"],
      message: "Invalid layout type",
    },
    default: "default",
  },
});

const PresentationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    topic: {
      type: String,
      required: [true, "Topic is required"],
      trim: true,
      maxlength: [200, "Topic cannot exceed 200 characters"],
    },
    slides: [slideSchema],
    templateId: {
      type: String,
      default: "modern_blue",
    },
    customTheme: {
      type: Object,
      default: null,
    },
    tone: {
      type: String,
      default: "professional",
    },
    slideCount: {
      type: Number,
      default: 5,
    },
    status: {
      type: String,
      enum: ["success", "failed", "processing", "deleted"],
      default: "processing",
    },
  },
  { timestamps: true },
);

PresentationSchema.index({ userId: 1, status: 1 });
PresentationSchema.index({ userId: 1, createdAt: -1 });

PresentationSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function () {
    try {
      for (const slide of this.slides) {
        for (const img of slide.images || []) {
          if (!img.url) continue;

          if (img.url.includes("/uploads/")) {
            const fileName = img.url.split("/uploads/")[1];
            const filePath = path.join(process.cwd(), "uploads", fileName);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
          }

          if (img.url.includes("cloudinary.com")) {
            const urlParts = img.url.split("/");
            const fileWithExt = urlParts[urlParts.length - 1];
            const fileName = fileWithExt.split(".")[0];
            const folder = urlParts[urlParts.length - 2];
            const publicId = `${folder}/${fileName}`;

            await cloudinary.uploader.destroy(publicId);
          }
        }
      }
    } catch (error) {
      console.error("Image cleanup error during deleteOne:", error);
    }
  },
);

const Presentation = mongoose.model("Presentation", PresentationSchema);
export default Presentation;
