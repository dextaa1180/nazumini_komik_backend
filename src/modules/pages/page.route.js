const router = require('express').Router({ mergeParams: true });
const pageController = require('./page.controller');
const upload = require('../../middlewares/multer.middlewares');
const { protect, restrictTo } = require('../../middlewares/auth.middlewares');

// 'image' adalah nama field di form-data
router.post(
    '/',
    protect,
    restrictTo('admin'),
    upload.single('image'),
    pageController.createPage
);

router.get('/', pageController.getAllPagesForChapter);

module.exports = router;