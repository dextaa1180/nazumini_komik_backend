// src/modules/user/user.route.js

const router = require('express').Router();
const userController = require('../auth/auth.controller'); // Ganti dengan controller yang sesuai
const { protect } = require('../../middlewares/auth.middlewares');

// Contoh rute yang akan kita buat nanti untuk mendapatkan data user yang sedang login.
// Ini akan membutuhkan middleware 'protect' yang sudah kita buat.
// router.get('/me', protect, userController.getMyProfile);

module.exports = router;