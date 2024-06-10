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
    const token = req.cookies.token;
    console.log(req.cookies);

    if (!token) {
        // Token is missing
        return res
            .status(403)
            .json({ message: "Forbidden. No token provided." });
    }

    if (!process.env.JWT_SECRET_KEY) {
        // JWT Secret Key is missing
        return res.status(500).json({
            message: "Internal server error. JWT secret key is missing.",
        });
    }

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET_KEY) as {
            id: number;
            username: string;
            departmentId: number;
        };

        // Set user information to request object
        req.user = {
            id: user.id,
            departmentId: user.departmentId,
            username: user.username,
        };

        next();
    } catch (err) {
        console.error("JWT verification failed:", err);
        res.clearCookie("token");
        return res
            .status(401)
            .json({ status: "timeout", message: "Invalid or expired token." });
    }
};
