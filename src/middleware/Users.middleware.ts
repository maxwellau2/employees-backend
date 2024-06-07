import Joi from "joi";
import { Request, Response, NextFunction } from "express";

export const newUserSchema = Joi.object({
  username: Joi.string().min(1).required(),
  password: Joi.string().min(1).required(),
  departmentId: Joi.number().valid(1, 2, 3).required(),
});

export const validateNewUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = newUserSchema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ status: "failed", data: error.details[0].message });
  }
  next();
};

export const loginSchema = Joi.object({
  username: Joi.string().min(1).required(),
  password: Joi.string().min(1).required(),
});

export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ status: "failed", data: error.details[0].message });
  }
  next();
};
