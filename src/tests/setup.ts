import pool from '../config/db';

beforeAll(async () => {
    // Очищаем таблицы перед тестами
    await pool.query('DELETE FROM notes');
    await pool.query('DELETE FROM users');
});

afterAll(async () => {
    await pool.end();
});