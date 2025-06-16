const { Series } = require('./series.model');
const BadRequestError = require('../../errors/BadRequestError');
const NotFoundError = require('../../errors/NotFoundError');
const { Genre } = require('../genres/genre.model');

/**
 * Membuat data series baru
 * @param {object} seriesData 
 * @returns {Promise<Series>}
 */
const createSeries = async (seriesData) => {
    const existingSeries = await Series.findOne({ where: { title: seriesData.title } });
    if (existingSeries) {
        throw new BadRequestError(`Series dengan judul "${seriesData.title}" sudah ada.`);
    }

    const newSeries = await Series.create(seriesData);
    return newSeries;
};

/**
 * Mengambil semua data series dengan opsi filter (status, type, genre).
 * @param {object} queryParams - Objek query dari URL (req.query)
 * @returns {Promise<Series[]>}
 */
const findAllSeries = async (queryParams) => {
    const { status, type, genre } = queryParams;

    // 1. Siapkan 'where' clause untuk filtering di tabel 'series'
    const whereClause = {};
    if (status) {
        whereClause.status = status;
    }
    if (type) {
        whereClause.type = type;
    }

    // 2. Siapkan 'include' clause untuk filtering di tabel 'genres'
    const includeClause = [{
        model: Genre,
        as: 'genres',
        attributes: ['name', 'slug'], // Hanya tampilkan nama dan slug genre
        through: { attributes: [] }
    }];

    // Jika ada query ?genre=... , tambahkan kondisi 'where' di dalam 'include'
    if (genre) {
        includeClause[0].where = { slug: genre };
    }

    // 3. Gabungkan semuanya dalam query findAll
    const allSeries = await Series.findAll({
        where: whereClause,
        include: includeClause,
        order: [['createdAt', 'DESC']]
    });

    return allSeries;
};

/**
 * Mencari satu series berdasarkan UUID.
 * @param {string} seriesUuid
 * @returns {Promise<Series>}
 */
const findSeriesByUuid = async (seriesUuid) => {
    const series = await Series.findOne({
        where: { uuid: seriesUuid },
        // Jika kita ingin mengambil data genre yang terkait, kita bisa gunakan include
        // Misalnya jika ada relasi many-to-many antara Series dan Genre
        include: {
            model: Genre,
            as: 'genres',
            through: { attributes: [] } // Jika ada tabel junction, kita bisa atur di sini
        }
    });

    if (!series) {
        throw new NotFoundError('Series dengan ID tersebut tidak ditemukan.');
    }

    return series;
};

/**
 * Mengupdate data series berdasarkan UUID.
 * @param {string} seriesUuid
 * @param {object} updateData
 * @returns {Promise<Series>}
 */
const updateSeriesByUuid = async (seriesUuid, updateData) => {
    // Kita gunakan lagi fungsi findSeriesByUuid untuk mencari datanya
    // Ini otomatis akan handle error 404 jika series tidak ditemukan
    const series = await findSeriesByUuid(seriesUuid);

    // Lakukan update
    await series.update(updateData);

    return series;
};

/**
 * Menghapus data series berdasarkan UUID.
 * @param {string} seriesUuid
 * @returns {Promise<void>}
 */
const deleteSeriesByUuid = async (seriesUuid) => {
    // Gunakan lagi fungsi yang sudah ada untuk mencari datanya
    // Ini otomatis akan handle error 404 jika series tidak ditemukan
    const series = await findSeriesByUuid(seriesUuid);

    // Hapus data dari database
    await series.destroy();
};

/**
 * Menambahkan satu atau lebih genre ke sebuah series.
 * @param {string} seriesUuid 
 * @param {number[]} genreIds 
 * @returns {Promise<Series>}
 */
const addGenresToSeries = async (seriesUuid, genreIds) => {
    // 1. Cari seriesnya
    const series = await findSeriesByUuid(seriesUuid);

    // 2. (Opsional tapi bagus) Verifikasi bahwa semua genreId ada di database
    const genres = await Genre.findAll({ where: { id: genreIds } });
    if (genres.length !== genreIds.length) {
        throw new BadRequestError('Satu atau lebih ID genre tidak valid.');
    }

    // 3. Gunakan 'fungsi ajaib' dari Sequelize untuk menambahkan asosiasi
    await series.addGenres(genreIds);

    // 4. Ambil kembali data series yang sudah terupdate dengan genre barunya
    const updatedSeries = await findSeriesByUuid(seriesUuid);
    return updatedSeries;
};



module.exports = {
    createSeries,
    findAllSeries,
    findSeriesByUuid,
    updateSeriesByUuid,
    deleteSeriesByUuid,
    addGenresToSeries
};