import request from 'supertest';
import app from '../app';
import pool from '../config/db';

describe('Auth Endpoints', () => {
    const timestamp = Date.now();
    const testEmail = `test-${timestamp}@test.com`;
    const loginEmail = `login-${timestamp}@test.com`;

    beforeEach(async () => {
        await pool.query('DELETE FROM users WHERE email LIKE \'%@test.com\'');
    });

    describe('POST /api/auth/register', () => {
        it('should register a new user', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Test User',
                    email: testEmail,
                    password: '123456'
                });

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('token');
            expect(res.body.user).toHaveProperty('email', testEmail);
            expect(res.body.user).not.toHaveProperty('password');
        });

        it('should not register with existing email', async () => {
            // Первая регистрация
            await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Test User',
                    email: testEmail,
                    password: '123456'
                });

            // Вторая попытка с тем же email
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Another User',
                    email: testEmail,
                    password: '123456'
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toContain('already exists');
        });
    });

    describe('POST /api/auth/login', () => {
        beforeEach(async () => {
            await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Login User',
                    email: loginEmail,
                    password: '123456'
                });
        });

        it('should login with correct credentials', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: loginEmail,
                    password: '123456'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('token');
            expect(res.body.user).toHaveProperty('email', loginEmail);
        });

        it('should not login with wrong password', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: loginEmail,
                    password: 'wrongpassword'
                });

            expect(res.statusCode).toBe(401);
        });
    });
});