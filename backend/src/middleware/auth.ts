import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_enterprise_key";

export interface AuthRequest extends Request {
    user?: { id: number; email: string };
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
    // 1. Force the header to be read as a string using 'unknown' first
    const authHeader = req.headers.authorization as unknown as string;
    const token = authHeader ? authHeader.split(" ") : null;
    
    if (!token) {
        res.status(401).json({ message: "Access Denied" });
        return;
    }

    try {
        // 2. Force the token and secret to be strings using 'unknown' first
        const verified = jwt.verify(
            token as unknown as string, 
            JWT_SECRET as unknown as string
        ) as any;
        
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ message: "Invalid Token" });
    }
};