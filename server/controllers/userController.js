import User from "../models/User.js";
import Presentation from "../models/Presentation.js";
import wrapAsync from "../utilities/wrapAsync.js";
import AppError from "../utilities/AppError.js";

export const getProfile = wrapAsync(async (req, res) => {
  res.status(200).json({ success: true, data: req.user });
});

export const updateProfile = wrapAsync(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) throw new AppError("User not found", 404);

  if (req.body.email && req.body.email !== user.email)
    throw new AppError("Email cannot be changed", 400);

  if (req.body.name) user.name = req.body.name;
  await user.save();

  const userResponse = user.toObject();
  delete userResponse.password;

  res.status(200).json({ success: true, data: userResponse });
});

export const deleteUser = wrapAsync(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) throw new AppError("User not found", 404);

  const presentations = await Presentation.find({ userId: user._id });
  await Promise.all(presentations.map((p) => p.deleteOne()));

  await user.deleteOne();

  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(200).json({
    success: true,
    message: "User and all presentations deleted successfully",
  });
});

export const getPPTHistory = wrapAsync(async (req, res) => {
  const history = await Presentation.find({ userId: req.user._id })
    .sort({
      createdAt: -1,
    })
    .lean();

  res.status(200).json({ success: true, count: history.length, data: history });
});

export const changePassword = wrapAsync(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select("+password");
  if (!user) throw new AppError("User not found", 404);

  const isMatch = await user.comparePassword(oldPassword);
  if (!isMatch) throw new AppError("Old password is incorrect", 401);

  user.password = newPassword;
  await user.save();

  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(200).json({
    success: true,
    message: "Password changed successfully. Please login again.",
  });
});
