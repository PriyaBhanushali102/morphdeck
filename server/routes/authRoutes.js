import express from "express";
import { authLimiter, forgotPasswordLimiter } from "../config/rateLimiter.js";
import validate from "../middleware/validate.js";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../validations/index.js";
import {
  authRegister,
  authLogin,
  authLogout,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import { isLoggedIn } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", authLimiter, validate(registerSchema), authRegister);
router.post("/login", authLimiter, validate(loginSchema), authLogin);
router.post(
  "/forgot-password",
  forgotPasswordLimiter,
  validate(forgotPasswordSchema),
  forgotPassword,
);

router.post("/logout", isLoggedIn, authLogout);
router.post(
  "/reset-password/:token",
  forgotPasswordLimiter,
  validate(resetPasswordSchema),
  resetPassword,
);

export default router;
