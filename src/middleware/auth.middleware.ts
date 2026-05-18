import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import AppError from '../utils/AppError';
import { email, string } from "zod";
import { findUserById } from "../models/user.model";

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number;
                email: string;
            };
        }
    }
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const protect = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')){
            return next(new AppError('Not authorized, no token', 401));
        }

        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(token, JWT_SECRET) as {id: number; email: string};

        const user = await findUserById(decoded.id);
        if (!user){
            return next(new AppError('Not authorized, user not found', 401));
        }
        req.user = { id: user.id, email: user.email };
        next();
    } catch (error) {
        next(new AppError('Not authorized, invalid token', 401));
    }
};