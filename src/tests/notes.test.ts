import request from 'supertest';
import app from '../app';
import pool from '../config/db';

describe('Notes Endpoints', () => {
    let authToken: string;
    let userId: number;
    let noteId: number;
    const timestamp = Date.now();
    const testEmail = `notes-${timestamp}@test.com`;

    beforeAll(async () => {
        // 1. Регистрация
        const registerRes = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Notes Tester',
                email: testEmail,
                password: '123456'
            });
        userId = registerRes.body.user.id;

        // 2. Логин (получаем токен)
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({
                email: testEmail,
                password: '123456'
            });
        authToken = loginRes.body.token;
    });

    afterAll(async () => {
        await pool.query('DELETE FROM notes WHERE user_id = $1', [userId]);
        await pool.query('DELETE FROM users WHERE id = $1', [userId]);
    });

    // ========== ТЕСТЫ ==========

    // 2.1 POST /api/notes (создание)
    describe('POST /api/notes', () => {

        it('should create a new note', async () => {
            const res = await request(app)
                .post('/api/notes')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    title: 'Test Note',
                    content: 'Test Content'
                })

            expect(res.statusCode).toBe(201);
            expect(res.body.data).toHaveProperty('title', 'Test Note');
            expect(res.body.data).toHaveProperty('user_id', userId);
        });

        it('should not create note without title', async () => {
            const res = await request(app)
                .post('/api/notes')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    content: 'No title'
                });

            expect(res.statusCode).toBe(400);
        });
    });

    // 2.2 GET /api/notes (все заметки)
    describe('GET /api/notes', () => {
        beforeEach(async () => {
            // Создаем заметку перед тестом
            const createRes = await request(app)
                .post('/api/notes')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ title: 'List Test Note', content: 'Content' });
                noteId = createRes.body.data.id
        });
        
        it ('should get all notes for authenticated user', async () => {
            const res =await request(app)
                .get('/api/notes')
                .set('Authorization', `Bearer ${authToken}`)
            
                expect(res.statusCode).toBe(200);
                expect(Array.isArray(res.body.data)).toBe(true);
                expect(res.body.data.length).toBeGreaterThan(0);
        });

         it('should support pagination structure', async () => {
            const res = await request(app)
                .get('/api/notes?page=1&limit=5')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('pagination');
            expect(res.body.pagination).toHaveProperty('page', 1);
            expect(res.body.pagination).toHaveProperty('limit', 5);
        });
     });

     // 2.3 GET /api/notes/:id (одна заметка)
     describe('GET /api/notes/:id', () => {
        beforeEach(async () => {
            const createRes = await request(app)
                .post('/api/notes')
                .set('Authorization', `Bearer ${authToken}`)
                .send({title: 'Single Note', content: 'Single content'});
            noteId = createRes.body.data.id;
        });

        it('should get note by id', async () => {
            const res = await request(app)
                .get(`/api/notes/${noteId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.data).toHaveProperty('title', 'Single Note');
        });

        it('should return 404 for not-existent note', async () => {
            const res = await request(app)
                .get('/api/notes/99999')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(404);
        });
     });

     // 2.4 PUT /api/notes/:id (обновление)
     describe('PUT /api/notes/:id', () => {
        beforeEach(async () => {
            const createRes = await request(app)
                .post('/api/notes')
                .set('Authorization', `Bearer ${authToken}`)
                .send({title: 'Before Update', content: 'Old'});
            noteId = createRes.body.data.id;
        });

        it('should update note', async () => {
            const res = await request(app)
                .put(`/api/notes/${noteId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({title: 'After Update', content: 'New'});

            expect(res.statusCode).toBe(200);
            expect(res.body.data).toHaveProperty('title', 'After Update');
            expect(res.body.data).toHaveProperty('content', 'New');
        });

        it('should return 404 for non-existent note', async () => {
            const res = await request(app)
                .put('/api/notes/99999')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ title: 'New Title' });

            expect(res.statusCode).toBe(404);
        });
     });

     // 2.5 DELETE /api/notes/:id (удаление)
     describe('DELETE /api/notes/:id', () => {
        beforeEach(async () => {
            const createRes = await request(app)
                .post('/api/notes')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ title: 'To Delete', content: 'Delete me' });
            noteId = createRes.body.data.id;
        });

        it('should delete note', async () => {
            const res = await request(app)
                .delete(`/api/notes/${noteId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(204);

            // Проверяем, что заметка действительно удалена
            const getRes = await request(app)
                .get(`/api/notes/${noteId}`)
                .set('Authorization', `Bearer ${authToken}`);
            expect(getRes.statusCode).toBe(404);
        });

        it('should return 404 for non-existent note', async () => {
            const res = await request(app)
                .delete('/api/notes/99999')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(404);
        });
    });
});
