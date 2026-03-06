import express from "express";
import validate from "../middleware/validate.js";
import { aiImageSchema } from "../validations/index.js";
import {
  uploadImage,
  generateAndUploadAiImage,
} from "../controllers/uploadController.js";
import { isLoggedIn } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/", isLoggedIn, upload.single("image"), uploadImage);

router.post(
  "/generate-ai",
  isLoggedIn,
  validate(aiImageSchema),
  generateAndUploadAiImage,
);

export default router;
