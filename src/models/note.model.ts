import pool from "../config/db";

export const createNote = async(userId: number, title: string, content: string) => {
    const result = await pool.query(
        `INSERT INTO notes (user_id, title, content) VALUES ($1, $2, $3) RETURNING *`,
        [userId, title, content || null]
    )
    return result.rows[0];
};

export const getNotesByUser = async (userId: number) => {
    
    const result = await pool.query(
        `SELECT * FROM notes WHERE user_id =$1 ORDER BY created_at DESC`,
        [userId]
    )
    return result.rows;
};

// Получить заметки пользователя с пагинацией и поиском
export const getNotesByUserPaginated = async (
    userId: number,
    limit: number,
    offset: number,
    searchTerm?: string,
    sortBy: string = 'created_at',
    order: string = 'desc',
    completed?: boolean  // ← новый параметр
) => {
    let query = `SELECT * FROM notes WHERE user_id = $1`;
    const params: any[] = [userId];
    let paramCount = 1;

    // Поиск
    if (searchTerm) {
        paramCount++;
        query += ` AND (title ILIKE $${paramCount} OR content ILIKE $${paramCount})`;
        params.push(`%${searchTerm}%`);
    }

    // ✅ Фильтр по статусу (новое)
    if (completed !== undefined) {
        paramCount++;
        query += ` AND completed = $${paramCount}`;
        params.push(completed);
    }

    // Сортировка
    query += ` ORDER BY ${sortBy} ${order}`;

    // Пагинация
    query += ` LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    return result.rows;
};

// Получить общее количество заметок пользователя (с учетом поиска)
export const getNotesCountByUser = async (
    userId: number, 
    searchTerm?: string,
    completed?: boolean  
) => {
    let query = `SELECT COUNT(*) FROM notes WHERE user_id = $1`;
    const params: any[] = [userId];
    let paramCount = 1;

    // Поиск
    if (searchTerm) {
        paramCount++;
        query += ` AND (title ILIKE $${paramCount} OR content ILIKE $${paramCount})`;
        params.push(`%${searchTerm}%`);
    }

    // ✅ Фильтр по статусу (новое)
    if (completed !== undefined) {
        paramCount++;
        query += ` AND completed = $${paramCount}`;
        params.push(completed);
    }

    const result = await pool.query(query, params);
    return parseInt(result.rows[0].count);
};

export const getNoteById = async (id: number, userId: number) => {
    const result = await pool.query(
        `SELECT * FROM notes WHERE id = $1 AND user_id = $2`,
        [id, userId] 
    )
    return result.rows[0] || null;
};

export const updateNote = async (id: number, userId: number, title?: string, content?: string) => {
    const result = await pool.query(
    `UPDATE notes 
     SET title = COALESCE($1, title), 
         content = COALESCE($2, content),
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $3 AND user_id = $4
     RETURNING *`,
     [title || null, content || null,id, userId]
    )
    return result.rows[0];
};

export const deleteNote = async (id: number, userId: number) => {
    const result = await pool.query(
        `DELETE FROM notes WHERE id = $1 AND user_id = $2 RETURNING id`,
        [id, userId]
    )
    return result.rows.length > 0;
};