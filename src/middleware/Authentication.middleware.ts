import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    username: string;
    departmentId: number;
  };
}

export const authenticateJWT = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  //   if (!req.cookies) {
  //     return res.status(403).json({ message: "Forbidden" });
  //   }
  const token = req.cookies.token;
  if (!token) {
    // token is null
    return res.status(403).json({ message: "Forbidden" });
  }
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET_KEY) as {
      id: number;
      username: string;
      departmentId: number;
    };
    //  how to set access rights to the next function
    req.user = {
      id: user.id,
      departmentId: user.departmentId,
      username: user.username,
    };
    next();
  } catch (err) {
    res.clearCookie("token");
    return res.status(401).json({ status: "timeout", message: "timeout" });
  }
};
