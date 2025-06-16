const express = require('express');
const userRoute = require('./modules/user/user.route');
const authRoute = require('./modules/auth/auth.route');
const seriesRoute = require('./modules/series/series.route');
const genreRoute = require('./modules/genres/genre.route');
const libraryRoute = require('./modules/library/library.route');

const router = express.Router();

// Daftarkan rute-rute baru
router.use('/auth', authRoute); // <-- Endpoint akan menjadi /api/v1/auth/login
router.use('/users', userRoute);
router.use('/series', seriesRoute);
router.use('/genres', genreRoute);
router.use('/library', libraryRoute);

module.exports = router;