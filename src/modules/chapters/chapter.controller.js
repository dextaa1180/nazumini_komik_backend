const chapterService = require('./chapter.service');
const asyncErrorHandler = require('../../errors/asyncErrorHandler');
const { SuccessResponse } = require('../../utils/apiResponse');

const createChapter = asyncErrorHandler(async (req, res, next) => {
    const { seriesUuid } = req.params;
    const chapterData = req.body;

    const newChapter = await chapterService.createChapter(seriesUuid, chapterData);

    new SuccessResponse({
        statusCode: 201,
        message: 'Chapter baru berhasil ditambahkan.',
        data: newChapter,
    }).send(res);
});

/**
 * Controller untuk mengambil semua chapter dari sebuah series.
 */
const getAllChaptersForSeries = asyncErrorHandler(async (req, res, next) => {
    const { seriesUuid } = req.params;
    const chapters = await chapterService.findChaptersBySeriesUuid(seriesUuid);

    new SuccessResponse({
        message: `Daftar chapter untuk series berhasil diambil.`,
        data: chapters,
    }).send(res);
});

module.exports = {
    createChapter,
    getAllChaptersForSeries,
};