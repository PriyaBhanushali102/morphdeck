// import cloudinary from "../config/cloudinary.js";
// import { GoogleGenAI } from "@google/genai";
// import wrapAsync from "../utilities/wrapAsync.js";
// import AppError from "../utilities/AppError.js";

// const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// const CURATED_STOCK_IMAGES = [
//   "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1280&q=80",
//   "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1280&q=80",
//   "https://images.unsplash.com/photo-1557683316-973673baf926?w=1280&q=80",
//   "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1280&q=80",
//   "https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0?w=1280&q=80",
//   "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1280&q=80",
// ];

// const fetchWithTimeout = async (url, options = {}, timeoutMs = 10000) => {
//   const controller = new AbortController();
//   const timer = setTimeout(() => controller.abort(), timeoutMs);
//   try {
//     return await fetch(url, { ...options, signal: controller.signal });
//   } finally {
//     clearTimeout(timer);
//   }
// };

// const uploadBufferToCloudinary = async (buffer, mimeType = "image/png") => {
//   const dataUri = `data:${mimeType};base64,${buffer.toString("base64")}`;
//   return cloudinary.uploader.upload(dataUri, {
//     folder: "morphdeck/ai-generated",
//     resource_type: "image",
//   });
// };

// // ─── TIER 1: Gemini Image Generation ──────────────────────────────────────────
// const generateWithGemini = async (rawTitle) => {
//   const prompt = `Professional corporate stock photo for a presentation slide titled "${rawTitle}".
// Clean, minimalist composition, modern business aesthetic.
// Absolutely NO text, NO words, NO letters, NO watermarks anywhere in the image.`;

//   const response = await ai.models.generateContent({
//     model: "gemini-2.0-flash-preview-image-generation", // or "gemini-2.5-flash-image-preview"
//     contents: [{ role: "user", parts: [{ text: prompt }] }],
//     generationConfig: {
//       // ✅ FIXED: correct key name
//       responseModalities: ["TEXT", "IMAGE"], // ✅ FIXED: must include TEXT
//     },
//   });

//   const parts = response?.candidates?.[0]?.content?.parts;
//   if (!parts?.length) throw new Error("Gemini: no candidates returned");

//   const imagePart = parts.find((p) => p.inlineData?.data);
//   if (!imagePart) {
//     // Log text response to understand why image was refused
//     const textPart = parts.find((p) => p.text);
//     throw new Error(
//       `Gemini: no image part. Model said: ${textPart?.text ?? "unknown reason"}`,
//     );
//   }

//   const mimeType = imagePart.inlineData.mimeType || "image/png";
//   const buffer = Buffer.from(imagePart.inlineData.data, "base64");
//   return { buffer, mimeType };
// };

// // ─── TIER 2: Pollinations fallback ────────────────────────────────────────────
// const generateWithPollinations = async (rawTitle) => {
//   const cleanKeywords = rawTitle
//     .replace(/[^a-zA-Z0-9 ]/g, " ")
//     .trim()
//     .split(/\s+/)
//     .slice(0, 5)
//     .join(" ");

//   const encodedPrompt = encodeURIComponent(
//     `${cleanKeywords}, professional business concept, minimalist, clean background, no text`,
//   );

//   const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1280&height=720&nologo=true&model=turbo&seed=${Date.now()}`;
//   const res = await fetchWithTimeout(
//     url,
//     { headers: { "User-Agent": "Mozilla/5.0" } },
//     15000,
//   );

//   if (!res.ok) throw new Error(`Pollinations HTTP ${res.status}`);

//   const buffer = Buffer.from(await res.arrayBuffer());
//   if (buffer.length < 5000)
//     throw new Error("Pollinations: response too small, likely an error page");

//   return { buffer, mimeType: "image/jpeg" };
// };

// // ─── TIER 3: Stock image fallback ─────────────────────────────────────────────
// const fetchStockImage = async (rawTitle) => {
//   const index =
//     Math.abs(rawTitle.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)) %
//     CURATED_STOCK_IMAGES.length;
//   const stockUrl = CURATED_STOCK_IMAGES[index];

//   const res = await fetchWithTimeout(stockUrl, {}, 10000);
//   if (!res.ok) throw new Error(`Stock image HTTP ${res.status}`);

//   const buffer = Buffer.from(await res.arrayBuffer());
//   return { buffer, mimeType: "image/jpeg" };
// };

// // ─── Main controller ──────────────────────────────────────────────────────────
// export const generateAndUploadAiImage = wrapAsync(async (req, res) => {
//   console.log("📥 Request body:", req.body); // ← add this
//   console.log("📥 Content-Type:", req.headers["content-type"]);

//   const rawTitle = (req.body.slideTitle || "Business Presentation").trim();

//   let buffer, mimeType, tier;

//   // TIER 1 — Gemini
//   try {
//     ({ buffer, mimeType } = await generateWithGemini(rawTitle));
//     tier = "gemini";
//     console.log("✅ TIER 1: Gemini image generated");
//   } catch (err) {
//     console.warn("⚠️  TIER 1 FAILED (Gemini):", err.message);

//     // TIER 2 — Pollinations
//     try {
//       ({ buffer, mimeType } = await generateWithPollinations(rawTitle));
//       tier = "pollinations";
//       console.log("✅ TIER 2: Pollinations image generated");
//     } catch (err2) {
//       console.warn("⚠️  TIER 2 FAILED (Pollinations):", err2.message);

//       // TIER 3 — Stock
//       try {
//         ({ buffer, mimeType } = await fetchStockImage(rawTitle));
//         tier = "stock";
//         console.log("✅ TIER 3: Stock image used");
//       } catch (err3) {
//         console.error("❌ ALL TIERS FAILED:", err3.message);
//         throw new AppError("All image sources failed. Please try again.", 502);
//       }
//     }
//   }

//   const result = await uploadBufferToCloudinary(buffer, mimeType);

//   res.status(200).json({
//     success: true,
//     url: result.secure_url,
//     source: tier, // helpful for debugging
//   });
// });

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
