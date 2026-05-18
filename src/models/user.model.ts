import bcrypt from 'bcryptjs'
import pool from "../config/db";

export const createUser = async(name: string, email: string, password: string) => {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
        'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, created_at', 
        [name, email, hashedPassword]
    );
    return result.rows[0];
};

export const findUserByEmail = async (email: string) => {
    const result = await pool.query(
        `SELECT * FROM users WHERE email = $1`,
        [email]
    );
    return result.rows[0] || null;
};

export const findUserById = async (id: number) => {
    const result = await pool.query(
        `SELECT id, name, email, created_at FROM users WHERE id = $1`,
        [id]
    );
    return result.rows[0] || null;
};