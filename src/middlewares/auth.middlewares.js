const jwt = require('jsonwebtoken');
const asyncErrorHandler = require('../errors/asyncErrorHandler');
const UnauthorizedError = require('../errors/UnauthorizedError');
const ForbiddenError = require('../errors/ForbiddenError');
const { User } = require('../modules/user/user.model'); // Asumsi model User diekspor dari sini
const config = require('../config/config');

/**
 * Middleware untuk memverifikasi JWT dan melindungi rute.
 * Memastikan hanya pengguna yang terautentikasi yang bisa melanjutkan.
 */
const protect = asyncErrorHandler(async (req, res, next) => {
    let token;

    // 1. Cek apakah ada token di header 'Authorization'
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    }

    if (!token) {
        return next(new UnauthorizedError('Anda tidak login. Silakan login untuk mendapatkan akses.'));
    }

    // 2. Verifikasi token
    let decoded;
    try {
        decoded = jwt.verify(token, config.jwt.secret);
    } catch (error) {
        return next(new UnauthorizedError('Token tidak valid atau sudah kedaluwarsa.'));
    }

    // 3. Cek apakah pengguna masih ada
    const currentUser = await User.findByPk(decoded.id);
    if (!currentUser) {
        return next(new UnauthorizedError('Pengguna dengan token ini sudah tidak ada lagi.'));
    }

    // 4. Cek apakah pengguna mengubah password setelah token diterbitkan (Opsional tapi bagus untuk keamanan)
    // if (currentUser.passwordChangedAfter(decoded.iat)) {
    //     return next(new UnauthorizedError('Password baru saja diubah. Silakan login kembali.'));
    // }

    // Jika semua verifikasi berhasil, lampirkan data pengguna ke request
    req.user = currentUser;
    next();
});

// Middleware tambahan untuk role-based access (jika diperlukan nanti)
const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ForbiddenError('Anda tidak memiliki izin untuk melakukan aksi ini.'));
        }
        next();
    };
};


module.exports = {
    protect,
    restrictTo
};