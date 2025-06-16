const router = require('express').Router();
const genreController = require('./genre.controller');
const validate = require('../../middlewares/validation.middlewares');
const { createGenreSchema, updateGenreSchema, deleteGenreSchema } = require('./genre.validator');
const { protect, restrictTo } = require('../../middlewares/auth.middlewares');

// Rute untuk membuat genre baru (hanya admin)
router.post(
    '/',
    protect,
    restrictTo('admin'),
    validate(createGenreSchema),
    genreController.createGenre
);

// Rute untuk update genre
router.patch(
    '/:id',
    protect,
    restrictTo('admin'),
    validate(updateGenreSchema),
    genreController.updateGenre
);

// Rute untuk delete genre
router.delete(
    '/:id',
    protect,
    restrictTo('admin'),
    validate(deleteGenreSchema),
    genreController.deleteGenre
);

// Rute untuk melihat semua genre (publik)
router.get('/', genreController.getAllGenres);

module.exports = router;