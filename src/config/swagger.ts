import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Notes API',
            version: '1.0.0',
            description: 'API для управления заметками с авторизацией',
        },
        servers: [
            {
                url: 'http://localhost:3000/api',
                description: 'Локальный сервер',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        name: { type: 'string', example: 'Иван Петров' },
                        email: { type: 'string', example: 'ivan@mail.com' },
                        created_at: { type: 'string', format: 'date-time' }
                    }
                },
                Note: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        title: { type: 'string', example: 'Купить молоко' },
                        content: { type: 'string', example: 'В магазине у дома' },
                        completed: { type: 'boolean', example: false },
                        user_id: { type: 'integer', example: 1 },
                        created_at: { type: 'string', format: 'date-time' },
                        updated_at: { type: 'string', format: 'date-time' }
                    }
                },
                Pagination: {
                    type: 'object',
                    properties: {
                        page: { type: 'integer', example: 1 },
                        limit: { type: 'integer', example: 10 },
                        total: { type: 'integer', example: 25 },
                        totalPages: { type: 'integer', example: 3 },
                        hasNextPage: { type: 'boolean', example: true },
                        hasPrevPage: { type: 'boolean', example: false }
                    }
                }
            }
        },
        security: [{ bearerAuth: [] }]
    },
    apis: [process.env.NODE_ENV === 'production' ? './dist/routes/*.js' : './src/routes/*.ts'],
    //apis: ['./src/routes/*.ts'], // ← путь к файлам с комментариями
};

export const specs = swaggerJsdoc(options);