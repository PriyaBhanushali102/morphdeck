import express from "express";
import validate from "../middleware/validate.js";
import { checkoutSchema } from "../validations/index.js";
import { createCheckoutSession } from "../controllers/paymentController.js";
import { isLoggedIn } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/checkout",
  isLoggedIn,
  validate(checkoutSchema),
  createCheckoutSession,
);

export default router;
