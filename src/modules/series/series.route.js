const router = require('express').Router();
const seriesController = require('./series.controller');
const validate = require('../../middlewares/validation.middlewares');
const { createSeriesSchema, updateSeriesSchema, deleteSeriesSchema, assignGenresToSeriesSchema } = require('./series.validator');
const { protect, restrictTo } = require('../../middlewares/auth.middlewares');
const chapterRouter = require('../chapters/chapter.route');
const upload = require('../../middlewares/multer.middlewares');

// Alur: Request -> Cek Token (protect) -> Cek Role (restrictTo) -> Validasi Data -> Controller
router.post(
    '/',
    protect,
    restrictTo('admin'),
    upload.single('coverImage'), 
    validate(createSeriesSchema),
    seriesController.createSeries
);

// Ini adalah rute publik, tidak perlu 'protect' atau 'restrictTo'
router.get('/', seriesController.getAllSeries);

// Rute ini menangkap parameter dinamis 'uuid' dari URL
router.get('/:uuid', seriesController.getSeriesByUuid);

// Rute ini juga dilindungi untuk admin saja
router.patch(
    '/:uuid',
    protect,
    restrictTo('admin'),
    upload.single('coverImage'),
    validate(updateSeriesSchema),
    seriesController.updateSeries
);

router.delete(
    '/:uuid',
    protect,
    restrictTo('admin'),
    validate(deleteSeriesSchema),
    seriesController.deleteSeries
);

router.post(
    '/:seriesUuid/genres',
    protect,
    restrictTo('admin'),
    validate(assignGenresToSeriesSchema),
    seriesController.assignGenres
)

// Semua request ke /:seriesUuid/chapters akan diteruskan ke chapterRouter
router.use('/:seriesUuid/chapters', chapterRouter);

module.exports = router;