import express from "express";
import { pptLimiter } from "../config/rateLimiter.js";
import validate from "../middleware/validate.js";
import { generatePPTSchema, updatePPTSchema } from "../validations/index.js";
import {
  getAllPPTs,
  generatePPT,
  getPublicPPT,
  getPPTById,
  updatePPT,
  softDeletePPT,
  restorePPT,
  exportPPT,
  getDeletedPPTs,
  permanentDeletePPT,
} from "../controllers/pptController.js";
import { isLoggedIn } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/generate",
  isLoggedIn,
  pptLimiter,
  validate(generatePPTSchema),
  generatePPT,
);

router.get("/", isLoggedIn, getAllPPTs);
router.get("/deleted/all", isLoggedIn, getDeletedPPTs);
router.patch("/restore/:id", isLoggedIn, restorePPT);
router.delete("/permanent/:id", isLoggedIn, permanentDeletePPT);
router.get("/export/:id", isLoggedIn, exportPPT);
router.get("/view/:id", getPublicPPT);
router.get("/:id", isLoggedIn, getPPTById);
router.patch("/:id", isLoggedIn, validate(updatePPTSchema), updatePPT);
router.delete("/:id", isLoggedIn, softDeletePPT);

export default router;
