const router = require('express').Router({ mergeParams: true }); // <-- Tambahkan { mergeParams: true }
const chapterController = require('./chapter.controller');
const validate = require('../../middlewares/validation.middlewares');
const { createChapterSchema, deleteChapterSchema } = require('./chapter.validator');
const { protect, restrictTo } = require('../../middlewares/auth.middlewares');
const upload = require('../../middlewares/multer.middlewares');
const pageRouter = require('../pages/page.route');

// Route untuk membuat chapter baru dengan upload gambar
router.post(
    '/',
    protect,
    restrictTo('admin'),
    upload.array('pages', 100), // Maksimum 100 gambar
    validate(createChapterSchema),
    chapterController.createChapter
);

// Rute publik untuk mendapatkan semua chapter dari sebuah series
router.get('/', chapterController.getAllChaptersForSeries);

// Route untuk menghapus chapter (harus login sebagai admin)
router.delete(
    '/:chapterUuid',
    protect,
    restrictTo('admin'),
    validate(deleteChapterSchema),
    chapterController.deleteChapter
);

// Semua request ke /:chapterUuid/pages akan diteruskan ke pageRouter
router.use('/:chapterUuid/pages', pageRouter);

module.exports = router;