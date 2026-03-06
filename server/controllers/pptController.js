import Presentation from "../models/Presentation.js";
import User from "../models/User.js";
import {
  generateSlideContent,
  parsePresentationRequest,
} from "../services/aiService.js";
import THEME_COLORS from "../utilities/theme.js";
import { generatePptxBuffer } from "../utilities/pptExporter.js";
import wrapAsync from "../utilities/wrapAsync.js";
import AppError from "../utilities/AppError.js";

export const generatePPT = wrapAsync(async (req, res) => {
  let { prompt, topic, slideCount, tone, detail, instructions, templateId } =
    req.body;

  if (prompt && !topic) {
    try {
      const parsedParams = await parsePresentationRequest(prompt);
      topic = parsedParams.topic;
      slideCount = slideCount || parsedParams.slideCount;
      tone = tone || parsedParams.tone;
      detail = detail || parsedParams.detail;
      instructions = instructions || parsedParams.instructions;
      templateId = templateId || parsedParams.templateId;
    } catch {
      topic = prompt;
    }
  }

  if (!topic) throw new AppError("Topic is required", 400);

  slideCount = Number(slideCount) || 5;
  if (slideCount <= 0 || slideCount > 20)
    throw new AppError("Invalid slide count", 400);

  const user = await User.findById(req.user.id);
  if (!user) throw new AppError("User not found", 404);
  if (user.credits <= 0)
    throw new AppError("Insufficient credits. Please upgrade your plan.", 403);

  const slides = await generateSlideContent(
    topic,
    slideCount,
    detail,
    tone,
    instructions,
  );

  const savedPPT = await Presentation.create({
    userId: user._id,
    topic,
    slides,
    slideCount: slides.length,
    templateId: templateId || "modern_blue",
    tone: tone || "professional",
    status: "success",
  });

  user.credits -= 1;
  await user.save();

  res.status(201).json({
    success: true,
    message: "PPT generated successfully",
    data: {
      pptId: savedPPT._id,
      slides: savedPPT.slides,
      slideCount: savedPPT.slideCount,
      remainingCredits: user.credits,
    },
  });
});

export const getAllPPTs = wrapAsync(async (req, res) => {
  const activePPTs = await Presentation.find({
    userId: req.user.id,
    status: { $ne: "deleted" },
  }).lean();

  res.status(200).json({
    success: true,
    message: "Active presentations fetched successfully",
    data: activePPTs,
  });
});

export const getPPTById = wrapAsync(async (req, res) => {
  const ppt = await Presentation.findById(req.params.id);
  if (!ppt) throw new AppError("Presentation not found", 404);

  if (req.user && ppt.userId.toString() !== req.user.id) {
    throw new AppError("Unauthorized", 403);
  }
  res.status(200).json({ success: true, data: ppt });
});

export const getPublicPPT = wrapAsync(async (req, res) => {
  const ppt = await Presentation.findById(req.params.id)
    .select("topic slides templateId customTheme")
    .lean();

  if (!ppt) throw new AppError("Presentation not found", 404);
  if (ppt.status === "deleted") throw new AppError("Not available", 404);

  res.status(200).json({ success: true, data: ppt });
});

export const updatePPT = wrapAsync(async (req, res) => {
  const { slides, topic, templateId, tone, status, customTheme } = req.body;

  const ppt = await Presentation.findOne({
    _id: req.params.id,
    userId: req.user.id,
  });
  if (!ppt) throw new AppError("Presentation not found or unauthorized", 404);

  if (ppt.status === "deleted" && status !== "success")
    throw new AppError(
      "Cannot edit a deleted presentation. Please restore first.",
      400,
    );

  if (slides && Array.isArray(slides)) {
    ppt.slides = slides;
    ppt.slideCount = slides.length;
  }
  if (topic) ppt.topic = topic;
  if (templateId) ppt.templateId = templateId;
  if (tone) ppt.tone = tone;
  if (status) ppt.status = status;
  if (customTheme) ppt.customTheme = customTheme;

  const updatedPPT = await ppt.save();
  res.status(200).json({
    success: true,
    message: "Presentation updated successfully",
    data: updatedPPT,
  });
});

export const softDeletePPT = wrapAsync(async (req, res) => {
  const ppt = await Presentation.findOne({
    _id: req.params.id,
    userId: req.user.id,
  });
  if (!ppt) throw new AppError("Presentation not found", 404);

  ppt.status = "deleted";
  await ppt.save();

  res
    .status(200)
    .json({ success: true, message: "Presentation deleted successfully." });
});

export const restorePPT = wrapAsync(async (req, res) => {
  const ppt = await Presentation.findOne({
    _id: req.params.id,
    userId: req.user.id,
  });
  if (!ppt) throw new AppError("Presentation not found", 404);

  ppt.status = "success";
  await ppt.save();

  res.status(200).json({
    success: true,
    message: "Presentation restored successfully",
    data: ppt,
  });
});

export const exportPPT = wrapAsync(async (req, res) => {
  const pptData = await Presentation.findOne({
    _id: req.params.id,
    userId: req.user.id,
  }).lean();
  if (!pptData) throw new AppError("PPT not found", 404);

  const theme =
    pptData.templateId === "custom" && pptData.customTheme
      ? {
          bg: pptData.customTheme.colors.background,
          text: pptData.customTheme.colors.text,
          accent: pptData.customTheme.colors.accent,
          font: pptData.customTheme.font,
        }
      : THEME_COLORS[pptData.templateId] || THEME_COLORS.modern_blue;

  const buffer = await generatePptxBuffer(pptData, theme);

  res.set({
    "Content-Type":
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "Content-Disposition": `attachment; filename="${pptData.topic.replace(/\s+/g, "_")}.pptx"`,
    "Content-Length": buffer.length,
  });

  res.send(buffer);
});

export const getDeletedPPTs = wrapAsync(async (req, res) => {
  const deletedPPTs = await Presentation.find({
    userId: req.user.id,
    status: "deleted",
  })
    .sort({ updatedAt: -1 })
    .lean();

  res.status(200).json({
    success: true,
    message: "Deleted presentations fetched successfully",
    data: deletedPPTs,
  });
});

export const permanentDeletePPT = wrapAsync(async (req, res) => {
  const ppt = await Presentation.findOne({
    _id: req.params.id,
    userId: req.user.id,
  });
  if (!ppt) throw new AppError("Presentation not found", 404);

  await ppt.deleteOne();

  res
    .status(200)
    .json({ success: true, message: "Presentation permanently deleted" });
});
