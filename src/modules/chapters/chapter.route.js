const router = require('express').Router({ mergeParams: true }); // <-- Tambahkan { mergeParams: true }
const chapterController = require('./chapter.controller');
const validate = require('../../middlewares/validation.middlewares');
const { createChapterSchema } = require('./chapter.validator');
const { protect, restrictTo } = require('../../middlewares/auth.middlewares');
const pageRouter = require('../pages/page.route');

router.post(
    '/',
    protect,
    restrictTo('admin'),
    validate(createChapterSchema),
    chapterController.createChapter
);

// Rute publik untuk mendapatkan semua chapter dari sebuah series
router.get('/', chapterController.getAllChaptersForSeries);

// Semua request ke /:chapterUuid/pages akan diteruskan ke pageRouter
router.use('/:chapterUuid/pages', pageRouter);

module.exports = router;