import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';
import { getAllNotes, getNote, createNote, updateNote, deleteNote } from '../controllers/noteController';

const router = Router();

// Все роуты заметок защищены
router.use(protect);  // ← применяется ко всем роутам ниже

/**
 * @swagger
 * /notes:
 *   get:
 *     summary: Получить все заметки текущего пользователя
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Номер страницы
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Количество заметок на странице
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Поиск по заголовку или содержанию
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [title, created_at, updated_at]
 *         description: Поле для сортировки
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Направление сортировки
 *     responses:
 *       200:
 *         description: Список заметок
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 results:
 *                   type: integer
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Note'
 *       401:
 *         description: Не авторизован
 */
router.get('/', protect, getAllNotes);

/**
 * @swagger
 * /notes/{id}:
 *   get:
 *     summary: Получить заметку по её ID
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID заметки
 *     responses:
 *       200:
 *         description: Найденная заметка
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Note'
 *       404:
 *         description: Заметка не найдена
 *       401:
 *         description: Не авторизован
 */
router.get('/:id', getNote);

/**
 * @swagger
 * /notes:
 *   post:
 *     summary: Создать новую заметку
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Новая заметка"
 *               content:
 *                 type: string
 *                 example: "Содержимое заметки"
 *     responses:
 *       201:
 *         description: Заметка создана
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Note'
 *       400:
 *         description: Ошибка валидации (нет заголовка)
 *       401:
 *         description: Не авторизован
 */
router.post('/', createNote);


/**
 * @swagger
 * /notes/{id}:
 *   put:
 *     summary: Обновить существующую заметку
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID заметки
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Обновлённый заголовок"
 *               content:
 *                 type: string
 *                 example: "Обновлённое содержимое"
 *     responses:
 *       200:
 *         description: Заметка обновлена
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Note'
 *       404:
 *         description: Заметка не найдена
 *       401:
 *         description: Не авторизован
 */
router.put('/:id', updateNote);

/**
 * @swagger
 * /notes/{id}:
 *   delete:
 *     summary: Удалить заметку
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID заметки
 *     responses:
 *       204:
 *         description: Заметка успешно удалена (нет содержимого)
 *       404:
 *         description: Заметка не найдена
 *       401:
 *         description: Не авторизован
 */
router.delete('/:id', deleteNote);

export default router;