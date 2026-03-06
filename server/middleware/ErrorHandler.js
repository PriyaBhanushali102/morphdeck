import AppError from "../utilities/AppError.js";

// DB/JWT Error Handlers
const handleDBCastError = (err) =>
  new AppError(`Invalid ${err.path}: ${err.value}`, 400);
const handleDBDuplicateFields = (err) =>
  new AppError(
    `Duplicate value: ${err.message.match(/(["'])(\\?.)*?\1/)[0]}. Please use another value`,
    400,
  );
const handleDBValidationError = (err) =>
  new AppError(
    `Invalid input: ${Object.values(err.errors)
      .map((e) => e.message)
      .join(". ")}`,
    400,
  );
const handleJWTError = () =>
  new AppError("Invalid token. Please log in again!", 401);
const handleJWTExpiredError = () =>
  new AppError("Your token has expired! Please log in again.", 401);

// Error Senders
const sendErrorDev = (err, res) =>
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });

const sendErrorProd = (err, res) =>
  err.isOperational
    ? res
        .status(err.statusCode)
        .json({ status: err.status, message: err.message })
    : res
        .status(500)
        .json({ status: "error", message: "Something went very wrong!" });

// GLOBAL ERROR HANDLER
export const globalErrorHandler = (err, req, res) => {
  console.error("🔴 Global error:", err);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") return sendErrorDev(err, res);

  let error = Object.assign(Object.create(Object.getPrototypeOf(err)), err);
  error.message = err.message;

  if (err.name === "CastError") error = handleDBCastError(error);
  if (err.code === 11000) error = handleDBDuplicateFields(error);
  if (err.name === "ValidationError") error = handleDBValidationError(error);
  if (err.name === "JsonWebTokenError") error = handleJWTError();
  if (err.name === "TokenExpiredError") error = handleJWTExpiredError();

  sendErrorProd(error, res);
};

export const handle404 = (req, res, next) =>
  next(new AppError(`Cannot find ${req.originalUrl}`, 404));
