// file: server/src/middlewares/errorHandler.middlewares.js

const { ZodError } = require('zod');
const HttpError = require('../errors/HttpError');
const parseZodError = require('../errors/zod');

/**
 * Middleware untuk menangani error secara global.
 * @param {Error} err - Objek error yang dilempar.
 * @param {import('express').Request} req - Objek request Express.
 * @param {import('express').Response} res - Objek response Express.
 * @param {import('express').NextFunction} next - Fungsi next Express.
 */
function errorHandler(err, req, res, next) {
    // Log error asli ke konsol untuk debugging, terlepas dari environment
    console.error('ERROR 💥:', err);

    let statusCode = 500;
    let message = 'Terjadi kesalahan pada server.';
    let details = null;

    // 1. Tangani Zod validation errors
    if (err instanceof ZodError) {
        statusCode = 400; // Bad Request
        message = 'Data yang diberikan tidak valid.';
        details = parseZodError(err);
    }
    // 2. Tangani custom HttpError yang kita buat
    else if (err instanceof HttpError) {
        statusCode = err.statusCode;
        message = err.message;
    }

    // Siapkan respons error
    const errorResponse = {
        status: 'error',
        statusCode,
        message,
        ...(details && { details }), // Tambahkan 'details' jika ada (untuk Zod)
    };

    // 3. Hanya tampilkan stack trace di mode development
    if (process.env.NODE_ENV === 'development') {
        errorResponse.stack = err.stack;
    }

    res.status(statusCode).json(errorResponse);
}

module.exports = errorHandler;