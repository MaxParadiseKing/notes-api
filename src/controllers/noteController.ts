import { Request, Response, NextFunction } from "express";
import * as NoteModel from '../models/note.model';
import AppError from '../utils/AppError';


export const getAllNotes = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return next(new AppError('Not authorized', 401));
        }

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const offset = (page - 1) * limit;
        const searchTerm = req.query.search as string;
        const sortBy = req.query.sortBy as string || 'created_at';
        const order = req.query.order as string || 'desc';

        // ✅ Чтение параметра completed
        const completedParam = req.query.completed as string;
        let completed: boolean | undefined = undefined;
        if (completedParam === 'true') {
            completed = true;
        } else if (completedParam === 'false') {
            completed = false;
        }

        // Проверка безопасности для сортировки
        const allowedSortFields = ['title', 'created_at', 'updated_at'];
        if (!allowedSortFields.includes(sortBy)) {
            return next(new AppError('Invalid sort field', 400));
        }
        if (order !== 'asc' && order !== 'desc') {
            return next(new AppError('Order must be asc or desc', 400));
        }

        const notes = await NoteModel.getNotesByUserPaginated(
            req.user.id, limit, offset, searchTerm, sortBy, order, completed
        );
        
        const total = await NoteModel.getNotesCountByUser(req.user.id, searchTerm, completed);

        res.json({
            status: 'success',
            results: notes.length,
            pagination: { 
                page, 
                limit, total, 
                totalPages: Math.ceil(total / limit),
                hasNextPage: page < Math.ceil(total / limit),
                hasPrevPage: page > 1 
                },
            data: notes
        });
    } catch (error) {
        next(error);
    }
};

export const getNote = async (req: Request, res: Response, next: NextFunction) => {
    try {
          if (!req.user) {
            return next(new AppError('Not authorized', 401));
        }
        // 1. id из req.params.id
        const idParam = req.params.id as string;
        const id = parseInt(idParam);

        // 2. Проверка на NaN
        if (isNaN(id)) {
            return next(new AppError('Invalid note ID', 400));
        }

        // 3. Найти заметку
        const note = await NoteModel.getNoteById(id, req.user.id);
        // 4. Проверить, что есть
        if (!note) {
            return next(new AppError('Note not found', 404));
        }
        // 5. Отправить ответ
        res.json({
            status: 'success',
            data: note
        })
    } catch (error) {
        next(error);
    }
};

export const createNote = async (req: Request, res: Response, next: NextFunction) => {
    try {
         if (!req.user) {
            return next(new AppError('Not authorized', 401));
        }
        // 1. Взять title, content из req.body
        const {title, content} = req.body
        // 2. Проверить, что title есть
        if(!title){
            return next(new AppError('Title not found', 400));
        }
        // 3. Создать заметку через NoteModel.createNote
        const note = await NoteModel.createNote(req.user.id, title, content);
        // 4. Отправить ответ 201
        res.status(201).json({
            status: 'success',
            data: note
        })
    } catch (error) {
        next(error);
    }
};

export const updateNote = async(req: Request, res: Response, next: NextFunction) => {
    try{
        if (!req.user) {
            return next(new AppError('Not authorized', 401));
        }
        // 1. id из req.params.id
        const idParam = req.params.id as string;
        const id = parseInt(idParam);

        // 2. Проверка на NaN
        if (isNaN(id)) {
            return next(new AppError('Invalid note ID', 400));
        }

        const {title, content} = req.body;

         const existingNote = await NoteModel.getNoteById(id, req.user.id);
        if (!existingNote) {
            return next(new AppError('Note not found', 404));
        }

        const note = await NoteModel.updateNote(id, req.user.id, title, content);

        res.status(200).json({
            status: 'success',
            data: note
        })
    }
    catch(error) {
        next(error);
    }
};

export const deleteNote = async(req: Request, res: Response, next: NextFunction) => {
    try{
        // 1. Проверка авторизации
        if (!req.user) {
            return next(new AppError('Not authorized', 401));
        }
        // 2. Получение id из params
        const idParam = req.params.id as string;
        const id = parseInt(idParam);

        // 2. Проверка на NaN
        if (isNaN(id)) {
            return next(new AppError('Invalid note ID', 400));
        }
        // 3. Удаление
        const delited = await NoteModel.deleteNote(id, req.user.id);
        // 4. Проверка, что удалилось
        if(!delited){
            return next(new AppError('Note not found', 404));
        }
        // 5. Ответ 204
        res.status(204).json({
            status: 'success'
        })
    }
    catch(error) {
        next(error);
    }
};

