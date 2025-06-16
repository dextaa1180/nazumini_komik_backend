const { Chapter } = require('./chapter.model');
const { Series } = require('../series/series.model'); // Kita butuh model Series
const BadRequestError = require('../../errors/BadRequestError');
const NotFoundError = require('../../errors/NotFoundError');
const seriesService = require('../series/series.service');
const cloudinary = require('../../utils/cloudinaryUploader');

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

/**
 * Menghapus chapter berdasarkan UUID
 * @param {string} seriesUuid
 * @param {string} chapterUuid
 */
const deleteChapter = async (seriesUuid, chapterUuid) => {
    // 1. Validasi series
    const series = await Series.findOne({ where: { uuid: seriesUuid } });
    if (!series) {
        throw new NotFoundError('Series tidak ditemukan.');
    }

    // 2. Cari chapter yang akan dihapus
    const chapter = await Chapter.findOne({
        where: {
            uuid: chapterUuid,
            series_id: series.id
        }
    });

    if (!chapter) {
        throw new NotFoundError('Chapter tidak ditemukan.');
    }

    // 3. Hapus gambar dari Cloudinary jika ada
    try {
        // Dapatkan semua pages yang terkait dengan chapter ini
        const pages = await chapter.getPages();
        
        // Hapus gambar dari Cloudinary
        for (const page of pages) {
            if (page.imageUrl) {
                const publicId = page.imageUrl.split('/').pop().split('.')[0];
                await cloudinary.destroy(publicId);
            }
        }

        // 4. Hapus chapter dan semua relasinya (pages akan terhapus otomatis karena CASCADE)
        await chapter.destroy();
    } catch (error) {
        throw new Error('Gagal menghapus chapter dan gambar terkait.');
    }
};

module.exports = {
    createChapter,
    findChaptersBySeriesUuid,
    deleteChapter,
};