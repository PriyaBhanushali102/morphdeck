import cloudinary from "../config/cloudinary.js";
import { GoogleGenAI } from "@google/genai";
import wrapAsync from "../utilities/wrapAsync.js";
import AppError from "../utilities/AppError.js";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const uploadBufferToCloudinary = async (buffer, mimeType = "image/png") => {
  const dataUri = `data:${mimeType};base64,${buffer.toString("base64")}`;
  return cloudinary.uploader.upload(dataUri, {
    folder: "morphdeck/ai-generated",
    resource_type: "image",
  });
};

const generateWithGemini = async (rawTitle) => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-image-generation",
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `Professional corporate stock photo for a presentation slide titled "${rawTitle}". Clean, minimalist composition, modern business aesthetic. Absolutely NO text, NO words, NO letters, NO watermarks anywhere in the image.`,
          },
        ],
      },
    ],
    generationConfig: {
      responseModalities: ["TEXT", "IMAGE"],
    },
  });

  const parts = response?.candidates?.[0]?.content?.parts;
  if (!parts?.length) throw new Error("No candidates returned");

  const imagePart = parts.find((p) => p.inlineData?.data);
  if (!imagePart) {
    const reason = parts.find((p) => p.text)?.text ?? "unknown";
    throw new Error(`No image part. Model said: ${reason}`);
  }

  return {
    buffer: Buffer.from(imagePart.inlineData.data, "base64"),
    mimeType: imagePart.inlineData.mimeType || "image/png",
  };
};

const fetchFromUnsplash = async (rawTitle) => {
  const query = rawTitle
    .replace(/[^a-zA-Z0-9 ]/g, " ")
    .trim()
    .split(/\s+/)
    .slice(0, 3)
    .join(" ");

  const res = await fetch(
    `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&orientation=landscape`,
    {
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
      },
    },
  );

  if (!res.ok) throw new Error(`Unsplash HTTP ${res.status}`);

  const data = await res.json();
  const imageUrl = data?.urls?.regular;
  if (!imageUrl) throw new Error("No image URL from Unsplash");

  const imgRes = await fetch(imageUrl);
  if (!imgRes.ok) throw new Error("Failed to download Unsplash image");

  const buffer = Buffer.from(await imgRes.arrayBuffer());
  return { buffer, mimeType: "image/jpeg" };
};

export const generateAndUploadAiImage = wrapAsync(async (req, res) => {
  const rawTitle = (req.body.slideTitle || "Business Presentation").trim();

  try {
    const { buffer, mimeType } = await generateWithGemini(rawTitle);
    const result = await uploadBufferToCloudinary(buffer, mimeType);
    return res
      .status(200)
      .json({ success: true, url: result.secure_url, source: "ai" });
  } catch (err) {
    console.error("⚠️ Gemini failed:", err.message);
  }

  try {
    const { buffer, mimeType } = await fetchFromUnsplash(rawTitle);
    const result = await uploadBufferToCloudinary(buffer, mimeType);
    return res
      .status(200)
      .json({ success: true, url: result.secure_url, source: "unsplash" });
  } catch {
    throw new AppError("Image generation unavailable. Please try again.", 503);
  }
});

export const uploadImage = wrapAsync(async (req, res) => {
  if (!req.file) throw new AppError("No file uploaded", 400);

  const result = await cloudinary.uploader.upload(
    `data:${req.file.mimetype};base64,${Buffer.from(req.file.buffer).toString("base64")}`,
    { folder: "ai-ppt-generator" },
  );

  res.status(200).json({ success: true, url: result.secure_url });
});
