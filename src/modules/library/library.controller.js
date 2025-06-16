const libraryService = require('./library.service');
const asyncErrorHandler = require('../../errors/asyncErrorHandler');
const { SuccessResponse } = require('../../utils/apiResponse');

const addSeriesToLibrary = asyncErrorHandler(async (req, res, next) => {
    const user = req.user; // User yang sedang login
    const { seriesUuid } = req.body;

    await libraryService.addSeriesToUserLibrary(user, seriesUuid);

    new SuccessResponse({
        message: 'Series berhasil ditambahkan ke library Anda.',
    }).send(res);
});

/**
 * Controller untuk mengambil library milik user yang sedang login.
 */
const getMyLibrary = asyncErrorHandler(async (req, res, next) => {
    // req.user disiapkan oleh middleware 'protect'
    const userId = req.user.id; 
    const libraryContent = await libraryService.findUserLibrary(userId);

    new SuccessResponse({
        message: 'Library berhasil diambil.',
        data: libraryContent,
    }).send(res);
});

/**
 * Controller untuk menghapus series dari library user.
 */
const removeSeriesFromLibrary = asyncErrorHandler(async (req, res, next) => {
    const user = req.user;
    const { seriesUuid } = req.body;

    await libraryService.removeSeriesFromUserLibrary(user, seriesUuid);

    // Respons sukses untuk DELETE adalah 204 No Content
    res.status(204).send();
});

module.exports = {
    addSeriesToLibrary,
    getMyLibrary,
    removeSeriesFromLibrary,
};