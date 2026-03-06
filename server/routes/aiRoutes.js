import express from "express";
import validate from "../middleware/validate.js";
import { rewriteSchema } from "../validations/index.js";
import { rewriteText } from "../services/aiService.js";
import { isLoggedIn } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/rewrite", isLoggedIn, validate(rewriteSchema), rewriteText);

export default router;
