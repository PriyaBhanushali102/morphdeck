import User from "../models/User.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { JWT_EXPIRATION, JWT_SECRET } from "../config/env.config.js";
import sendEmail from "../utilities/sendEmail.js";
import wrapAsync from "../utilities/wrapAsync.js";
import AppError from "../utilities/AppError.js";

const generateToken = (id, email) =>
  jwt.sign({ id: id.toString(), email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRATION,
  });

const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

const setCookie = (res, token) =>
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: COOKIE_MAX_AGE,
  });

export const authRegister = wrapAsync(async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) throw new AppError("User already exists", 400);

  const newUser = await User.create({ name, email, password });

  const token = generateToken(newUser._id.toString(), email);
  setCookie(res, token);

  const userResponse = newUser.toObject();
  delete userResponse.password;

  res.status(201).json({ success: true, token, data: userResponse });
});

export const authLogin = wrapAsync(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new AppError("User not found", 404);

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new AppError("Invalid credentials", 401);

  const token = generateToken(user._id, user.email);

  setCookie(res, token);

  const userResponse = user.toObject();
  delete userResponse.password;

  res.status(200).json({ success: true, token, data: userResponse });
});

export const authLogout = wrapAsync(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(200).json({ success: true, message: "Logged out successfully." });
});

export const forgotPassword = wrapAsync(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(200).json({
      success: true,
      message:
        "If an account exists with that email, a reset link has been sent.",
    });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  await user.save();

  const resetUrl = `${process.env.CORS_ORIGIN}/reset-password/${resetToken}`;
  const message = `You requested a password reset. Click the link below to set a new password:\n\n${resetUrl}\n\nThis link will expire in 15 minutes.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset Request",
      message,
    });
    res
      .status(200)
      .json({ success: true, message: "Reset link sent to email." });
  } catch {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    throw new AppError("Email could not be sent.", 500);
  }
});

export const resetPassword = wrapAsync(async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  }).select("+password");

  if (!user) throw new AppError("Invalid or expired reset token.", 400);

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res
    .status(200)
    .json({ success: true, message: "Password updated! You can now login." });
});
