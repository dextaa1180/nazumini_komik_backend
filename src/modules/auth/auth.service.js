// Perhatikan perubahan path import di sini
const { User } = require('../user/user.model'); 
const BadRequestError = require('../../errors/BadRequestError');
const UnauthorizedError = require('../../errors/UnauthorizedError');
const jwt = require('jsonwebtoken');
const config = require('../../config/config');

// (Kode fungsi createUser, generateToken, loginUser yang Anda paste di sini...)

const generateToken = (userId) => {
  const payload = { id: userId };
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn || '1d', // Token berlaku 1 hari
  });
};

const createUser = async (userData) => {
    // 1. Cek apakah email sudah terdaftar
    const existingUser = await User.findOne({ where: { email: userData.email } });
    if (existingUser) {
        // Jika sudah ada, lempar error yang akan ditangkap oleh errorHandler
        throw new BadRequestError('Email ini sudah terdaftar. Silakan gunakan email lain.');
    }

    // 2. Jika email belum ada, buat user baru
    const newUser = await User.create(userData);

    // 3. Kembalikan data user yang baru dibuat
    // Password sudah di-hash secara otomatis oleh hook di model
    return newUser;
};

const loginUser = async (email, password) => {
    // 1. Cari user berdasarkan email
    const user = await User.findOne({ where: { email } });
    if (!user) {
        throw new UnauthorizedError('Email atau password salah.');
    }

    // 2. Cek kecocokan password menggunakan method dari model
    const isPasswordCorrect = await user.isPasswordMatch(password);
    if (!isPasswordCorrect) {
        throw new UnauthorizedError('Email atau password salah.');
    }

    // 3. Jika user ada dan password cocok, buat token
    const token = generateToken(user.id);

    // 4. Kembalikan data user dan token
    return { user, token };
};

// Ekspor fungsi-fungsi yang sekarang berada di modul auth
module.exports = {
    createUser,
    loginUser,
};