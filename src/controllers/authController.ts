import { Request, Response, NextFunction } from "express";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createUser, findUserByEmail } from '../models/user.model';
import AppError from '../utils/AppError';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const register = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {name, email, password} = req.body;

        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return next(new AppError('Email already exists', 400));
        }

        const user = await createUser(name, email, password);

        const token = jwt.sign(
            {id: user.id, email: user.email},
            JWT_SECRET,
            {expiresIn: '24h'}
        );

        res.status(201).json({
            status: 'success',
            token,
            user
        })
    } catch (error){
        next(error);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // 1. Достать email, password
        const {email, password} = req.body;
        // 2. Найти пользователя
        const user = await findUserByEmail(email);
        if (!user) {
            return next(new AppError('invalid email or password', 401));
        }
        // 3. Проверить пароль
         const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return next(new AppError('Invalid email or password', 401));
        }
        // 4. Создать токен
         const token = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        // 5. Отправить ответ
        // Убираем пароль из ответа
        const { password: _, ...userWithoutPassword } = user;

        res.json({
            status: 'success',
            token,
            user: userWithoutPassword
        });
    } catch (error) {
        next(error);
    }
};