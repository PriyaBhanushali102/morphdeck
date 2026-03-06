import rateLimit from "express-rate-limit";

const createLimiter = (windowMs, max, message) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message },
  });

export const generalLimiter = createLimiter(
  15 * 60 * 1000,
  100,
  "Too many requests, please try again after 15 minutes.",
);
export const authLimiter = createLimiter(
  15 * 60 * 1000,
  10,
  "Too many login attempts, please try again after 15 minutes.",
);
export const forgotPasswordLimiter = createLimiter(
  60 * 60 * 1000,
  5,
  "Too many password reset attempts, please try again after 1 hour.",
);
export const pptLimiter = createLimiter(
  60 * 60 * 1000,
  20,
  "PPT generation limit reached, please try again after 1 hour.",
);
