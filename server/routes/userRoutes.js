import express from "express";
import validate from "../middleware/validate.js";
import {
  updateProfileSchema,
  changePasswordSchema,
} from "../validations/index.js";
import {
  getProfile,
  getPPTHistory,
  updateProfile,
  deleteUser,
  changePassword,
} from "../controllers/userController.js";
import { isLoggedIn } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/me", isLoggedIn, getProfile);
router.patch("/me", isLoggedIn, validate(updateProfileSchema), updateProfile);
router.delete("/me", isLoggedIn, deleteUser);
router.get("/history", isLoggedIn, getPPTHistory);
router.patch(
  "/changepassword",
  isLoggedIn,
  validate(changePasswordSchema),
  changePassword,
);

export default router;
