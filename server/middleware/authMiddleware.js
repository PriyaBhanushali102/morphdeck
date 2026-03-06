import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { JWT_SECRET } from "../config/env.config.js";
import AppError from "../utilities/AppError.js";
import wrapAsync from "../utilities/wrapAsync.js";

export const isLoggedIn = wrapAsync(async (req, res, next) => {
  const token = req.headers.authorization?.startsWith("Bearer")
    ? req.headers.authorization.split(" ")[1]
    : req.cookies?.token;

  if (!token)
    throw new AppError(
      "You are not logged in! Please log in to get access.",
      401,
    );

  const decoded = jwt.verify(token, JWT_SECRET);
  const user = await User.findById(decoded.id).select("-password");
  if (!user)
    throw new AppError(
      "The user belonging to this token no longer exists.",
      401,
    );

  req.user = user;
  next();
});
