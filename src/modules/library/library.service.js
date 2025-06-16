const seriesService = require('../series/series.service');
const { User } = require('../user/user.model');
const { Series } = require('../series/series.model');

/**
 * Menambahkan, Mangambil, Menghapus sebuah series ke library milik user.
 * @param {object} user - Objek user dari Sequelize (didapat dari req.user)
 * @param {string} seriesUuid - UUID dari series yang akan ditambahkan.
 * @returns {Promise<void>}
 */

const addSeriesToUserLibrary = async (user, seriesUuid) => {
    // 1. Cari series untuk memastikan seriesnya ada
    const series = await seriesService.findSeriesByUuid(seriesUuid);

    // 2. Gunakan 'fungsi ajaib' dari Sequelize untuk menambahkan asosiasi.
    //    Nama 'addLibrary' berasal dari alias 'as: library' yang kita definisikan di associations.js
    //    Sequelize akan otomatis menangani penambahan entri ke tabel 'user_libraries'
    //    dan secara otomatis mencegah duplikasi karena primary key gabungan kita.
    await user.addLibrary(series);
};

/**
 * Mengambil semua series yang ada di library milik user.
 * @param {number} userId - ID dari user yang sedang login.
 * @returns {Promise<Series[]>} Array dari objek series.
 */
const findUserLibrary = async (userId) => {
    // 1. Cari user berdasarkan Primary Key (ID)
    const user = await User.findByPk(userId, {
        // 2. Sertakan (include) data dari relasi 'library'
        include: {
            model: Series,
            as: 'library', // Gunakan alias yang kita definisikan di associations.js
            through: {
                attributes: [] // Agar data dari tabel penghubung tidak ikut ditampilkan
            }
        }
    });

    // 3. Kembalikan hanya array series dari library-nya
    return user.library;
};

/**
 * Menghapus sebuah series dari library milik user.
 * @param {object} user - Objek user dari Sequelize.
 * @param {string} seriesUuid - UUID dari series yang akan dihapus.
 * @returns {Promise<void>}
 */
const removeSeriesFromUserLibrary = async (user, seriesUuid) => {
    // 1. Cari series untuk memastikan seriesnya ada
    const series = await seriesService.findSeriesByUuid(seriesUuid);

    // 2. Gunakan 'fungsi ajaib' 'removeLibrary' dari Sequelize
    //    Ini akan mencari dan menghapus baris yang sesuai di tabel 'user_libraries'
    await user.removeLibrary(series);
};

module.exports = {
    addSeriesToUserLibrary,
    findUserLibrary,
    removeSeriesFromUserLibrary,
};