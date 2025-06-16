const { Chapter } = require('./chapter.model');
const { Series } = require('../series/series.model'); // Kita butuh model Series
const BadRequestError = require('../../errors/BadRequestError');
const NotFoundError = require('../../errors/NotFoundError');
const seriesService = require('../series/series.service');

/**
 * Membuat chapter baru untuk sebuah series.
 * @param {string} seriesUuid
 * @param {object} chapterData
 * @returns {Promise<Chapter>}
 */
const createChapter = async (seriesUuid, chapterData) => {
    // 1. Cari dulu series induknya
    const series = await Series.findOne({ where: { uuid: seriesUuid } });
    if (!series) {
        throw new NotFoundError('Series dengan ID tersebut tidak ditemukan.');
    }

    // 2. Cek apakah nomor chapter sudah ada untuk series ini
    const existingChapter = await Chapter.findOne({
        where: {
            series_id: series.id,
            chapterNumber: chapterData.chapterNumber,
        }
    });
    if (existingChapter) {
        throw new BadRequestError(`Chapter ${chapterData.chapterNumber} sudah ada untuk series ini.`);
    }

    // 3. Tambahkan series_id ke data chapter dan buat chapter baru
    const newChapter = await Chapter.create({
        ...chapterData,
        series_id: series.id, // Menghubungkan chapter ke series
    });

    return newChapter;
};

/**
 * Mencari semua chapter dari sebuah series berdasarkan UUID series, diurutkan dari terbaru.
 * @param {string} seriesUuid
 * @returns {Promise<Chapter[]>}
 */
const findChaptersBySeriesUuid = async (seriesUuid) => {
    // 1. Validasi dulu apakah seriesnya ada menggunakan service yang sudah kita buat
    const series = await seriesService.findSeriesByUuid(seriesUuid);

    // 2. Jika series ada, cari semua chapternya
    const chapters = await Chapter.findAll({
        where: {
            series_id: series.id
        },
        order: [
            ['chapterNumber', 'DESC'] // Urutkan berdasarkan nomor chapter, dari besar ke kecil (terbaru)
        ]
    });

    return chapters;
};

module.exports = {
    createChapter,
    findChaptersBySeriesUuid,
};