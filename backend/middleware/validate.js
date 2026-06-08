import { validationResult } from "express-validator";

export const validate = (req, _res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  const error = new Error("Validation failed");
  error.statusCode = 422;
  error.errors = result.array().map((item) => ({
    field: item.path,
    message: item.msg
  }));
  next(error);
};
