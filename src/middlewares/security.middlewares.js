const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const config = require('../config/config');

// Konfigurasi CORS: Izinkan frontend Anda untuk mengakses backend
const corsOptions = {
    origin: config.frontendUrl, // Ambil URL frontend dari .env
    optionsSuccessStatus: 200,
};

// Konfigurasi Rate Limiter: Batasi jumlah request dari satu IP
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 menit
    max: 100, // Batasi setiap IP hingga 100 request per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Terlalu banyak request dari IP ini, silakan coba lagi setelah 15 menit.',
});

// Kumpulkan semua middleware keamanan dalam satu array
const securityMiddlewares = [
    // 1. Atur berbagai header HTTP yang aman
    helmet(),

    // 2. Aktifkan CORS dengan opsi yang sudah ditentukan
    cors(corsOptions),

    // 3. Terapkan rate limiting untuk semua request
    limiter,

    // 5. Mencegah serangan HTTP Parameter Pollution
    hpp(),
];

module.exports = securityMiddlewares;