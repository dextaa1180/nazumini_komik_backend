const express = require('express');
const securityMiddlewares = require('./middlewares/security.middlewares');
const routes = require('./routes');
const NotFoundError = require('./errors/NotFoundError'); // Pastikan NotFoundError di-import
const errorHandler = require('./middlewares/errorHandler.middlewares');
require('./database/associations');

const app = express();

// 1. Middleware Global (dijalankan untuk setiap request)
// Keamanan, Parser, dll.
app.use(securityMiddlewares);
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));


// 2. Rute Aplikasi Utama
// Semua request yang diawali /api/v1 akan diarahkan ke file routes.js
app.use('/api/v1', routes);


// 3. Handle 404 Not Found
// Middleware ini akan berjalan jika tidak ada rute di atas yang cocok.
app.use((req, res, next) => {
    // Kita buat error baru dan lempar ke error handler final
    next(new NotFoundError("Resource tidak ditemukan di server ini."));
});


// 4. Final Error Handler
// Jaring pengaman terakhir yang menangkap semua error dari seluruh aplikasi.
app.use(errorHandler);


module.exports = app;