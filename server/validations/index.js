import Joi from "joi";

const password = Joi.string()
  .min(8)
  .pattern(/[A-Z]/, "uppercase")
  .pattern(/[0-9]/, "number")
  .required()
  .messages({
    "string.min": "Password must be at least 8 characters",
    "string.pattern.name": "Password must have at least one {#name}",
    "any.required": "Password is required",
  });

const email = Joi.string().trim().email().lowercase().required().messages({
  "string.email": "Please enter a valid email",
  "any.required": "Email is required",
});

//Auth
export const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required().messages({
    "string.min": "Name must be at least 2 characters",
    "any.required": "Name is required",
  }),
  email,
  password,
});

export const loginSchema = Joi.object({
  email,
  password: Joi.string()
    .required()
    .messages({ "any.required": "Password is required" }),
});

export const forgotPasswordSchema = Joi.object({ email });

export const resetPasswordSchema = Joi.object({ newPassword: password });

// PPT
export const generatePPTSchema = Joi.object({
  prompt: Joi.string().trim().min(3).max(500),
  topic: Joi.string().trim().min(3).max(200),
  slideCount: Joi.number().integer().min(3).max(20).default(10),
  tone: Joi.string().max(50).optional(),
  detail: Joi.string().optional(),
  instructions: Joi.string().optional(),
  templateId: Joi.string().optional(),
})
  .or("prompt", "topic")
  .messages({
    "object.missing": "Please provide a topic or prompt",
  });

export const updatePPTSchema = Joi.object({
  title: Joi.string().trim().min(3).max(100).optional(),
  topic: Joi.string().trim().min(3).max(200).optional(),
  slides: Joi.array().items(Joi.object()).optional(),
  templateId: Joi.string().optional(),
  tone: Joi.string().optional(),
  status: Joi.string()
    .valid("success", "failed", "processing", "deleted")
    .optional(),
  customTheme: Joi.object().allow(null).optional(),
})
  .min(1)
  .messages({
    "object.min": "At least one field required",
  });

export const rewriteSchema = Joi.object({
  text: Joi.string().trim().min(5).max(5000).required().messages({
    "string.min": "Text too short",
    "string.max": "Text cannot exceed 5000 characters",
    "any.required": "Text is required",
  }),
  tone: Joi.string().max(50).optional(),
});

// User
export const updateProfileSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).optional(),
  avatar: Joi.string()
    .uri()
    .optional()
    .messages({ "string.uri": "Avatar must be a valid URL" }),
})
  .min(1)
  .messages({ "object.min": "At least one field required" });

export const changePasswordSchema = Joi.object({
  oldPassword: Joi.string()
    .required()
    .messages({ "any.required": "Current password is required" }),
  newPassword: Joi.string().min(8).required().messages({
    "string.min": "Password must be at least characters",
    "any.required": "Password is required",
  }),
});

// Payment
export const checkoutSchema = Joi.object({
  planId: Joi.string()
    .trim()
    .required()
    .messages({ "any.required": "Plan ID is required" }),
});

//  Upload
export const aiImageSchema = Joi.object({
  slideTitle: Joi.string().trim().min(5).max(1000).required().messages({
    "string.min": "Slide title too short",
    "any.required": "Slide title is required",
  }),
});
