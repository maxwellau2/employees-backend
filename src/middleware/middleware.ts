
import Joi = require('joi');
import {Request,Response,NextFunction} from "express";


export const employeeSchema = Joi.object({
    name: Joi.string().min(1).required(),
    salary: Joi.number().greater(0).required(),
    department: Joi.string().valid('HR', 'PS').required(), // Assuming Department is a string enum
  });

export const validateEmployee = (req: Request, res: Response, next: NextFunction) => {
    const { error } = employeeSchema.validate(req.body);
    if (error) {
      return res.status(400).json({status: "failed", data:error.details[0].message});
    }
    next();
  };

export const windowSchema = Joi.object({
  start: Joi.number().greater(-1).required(),
  windowSize: Joi.number().greater(0).required(),
});

export const validateWindow = (req: Request, res: Response, next: NextFunction) => {
  const { error } = windowSchema.validate(req.query);
  if (error) {
    return res.status(400).json({status: "failed", data:error.details[0].message});
  }
  next();
};