const seriesService = require('./series.service');
const asyncErrorHandler = require('../../errors/asyncErrorHandler');
const { SuccessResponse } = require('../../utils/apiResponse');

const createSeries = asyncErrorHandler(async (req, res, next) => {
    const newSeries = await seriesService.createSeries(req.body);

    new SuccessResponse({
        statusCode: 201,
        message: 'Series baru berhasil ditambahkan.',
        data: newSeries,
    }).send(res);
});
/**
 * Controller untuk mengambil semua data series
 */
const getAllSeries = asyncErrorHandler(async (req, res, next) => {
    const allSeries = await seriesService.findAllSeries(req.query);

    new SuccessResponse({
        message: 'Semua data series berhasil diambil.',
        data: allSeries,
    }).send(res);
});

/**
 * Controller untuk mengambil data satu series berdasarkan UUID.
 */
const getSeriesByUuid = asyncErrorHandler(async (req, res, next) => {
    // Ambil uuid dari parameter URL (contoh: /series/ini-adalah-uuid)
    const { uuid } = req.params; 
    const series = await seriesService.findSeriesByUuid(uuid);

    new SuccessResponse({
        message: 'Data series berhasil diambil.',
        data: series,
    }).send(res);
});

/**
 * Controller untuk mengupdate data series.
 */
const updateSeries = asyncErrorHandler(async (req, res, next) => {
    const { uuid } = req.params;
    const updateData = req.body;

    const updatedSeries = await seriesService.updateSeriesByUuid(uuid, updateData);

    new SuccessResponse({
        message: 'Data series berhasil di-update.',
        data: updatedSeries,
    }).send(res);
});

/**
 * Controller untuk menghapus data series.
 */
const deleteSeries = asyncErrorHandler(async (req, res, next) => {
    const { uuid } = req.params;
    await seriesService.deleteSeriesByUuid(uuid);

    // Untuk 'DELETE', respons sukses yang paling tepat adalah 204 No Content.
    // Respons ini secara definisi tidak memiliki body.
    res.status(204).send();
});

/**
 * Controller untuk menugaskan genre ke series.
 */
const assignGenres = asyncErrorHandler(async (req, res, next) => {
    const { seriesUuid } = req.params;
    const { genreIds } = req.body;
    const updatedSeries = await seriesService.addGenresToSeries(seriesUuid, genreIds);

    new SuccessResponse({
        message: 'Genre berhasil ditambahkan ke series.',
        data: updatedSeries,
    }).send(res);
});

module.exports = {
    createSeries,
    getAllSeries,
    getSeriesByUuid,
    updateSeries,
    deleteSeries,
    assignGenres
};