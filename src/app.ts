import express, { Request, Response, NextFunction } from "express";
import dotenv from 'dotenv';
//import { createUser, findUserByEmail , findUserById } from "./models/user.model";
import authRoutes from './routes/authRoutes'
import noteRoutes from './routes/noteRoutes'
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

//Middleware
app.use(express.json());

// Роуты
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

//Tecтовый роут
app.get('/ping', (req: Request, res: Response) => {
    res.json({message: 'pong'});
}) 

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

//404 обработчик
app.use((req: Request, res: Response)=> {
    res.status(404).json({message: 'Route not found'});
});

//Глобальный обработчик ошибок
app.use((err: any, req: Request, res: Response, next: NextFunction)=> {
    console.error(err);
    res.status(err.statusCode || 500).json({
        message: err.message || 'Internal server error'
    });
});

export default app;  