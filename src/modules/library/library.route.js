const router = require('express').Router();
const libraryController = require('./library.controller');
const validate = require('../../middlewares/validation.middlewares');
const { addSeriesToLibrarySchema, removeSeriesFromLibrarySchema } = require('./library.validator');
const { protect } = require('../../middlewares/auth.middlewares');

// Rute ini hanya perlu middleware 'protect', karena semua user boleh memakainya.
router.post(
    '/add',
    protect,
    validate(addSeriesToLibrarySchema),
    libraryController.addSeriesToLibrary
);

router.get(
    '/me',
    protect, // Hanya user yang login yang bisa mengakses
    libraryController.getMyLibrary
);

router.delete(
    '/remove',
    protect,
    validate(removeSeriesFromLibrarySchema),
    libraryController.removeSeriesFromLibrary
);

module.exports = router;