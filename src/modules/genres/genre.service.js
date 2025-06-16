const { Genre } = require('./genre.model');
const BadRequestError = require('../../errors/BadRequestError');
const NotFoundError = require('../../errors/NotFoundError');

/**
 * Membuat genre baru
 * @param {object} genreData - berisi { name }
 * @returns {Promise<Genre>}
 */
const createGenre = async (genreData) => {
    const { name } = genreData;

    // 1. Buat "slug" dari nama genre
    // contoh: "Action Fantasy" -> "action-fantasy"
    const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

    // 2. Cek duplikasi berdasarkan nama atau slug
    const existingGenre = await Genre.findOne({
        where: { 
            [require('sequelize').Op.or]: [{ name: name }, { slug: slug }]
        }
    });

    if (existingGenre) {
        throw new BadRequestError(`Genre "${name}" atau slug "${slug}" sudah ada.`);
    }

    // 3. Simpan genre baru
    const newGenre = await Genre.create({ name, slug });
    return newGenre;
};

/**
 * Mengambil semua data genre
 * @returns {Promise<Genre[]>}
 */
const findAllGenres = async () => {
    return await Genre.findAll({
        order: [['name', 'ASC']] // Urutkan berdasarkan nama A-Z
    });
};

/**
 * Mencari satu genre berdasarkan ID.
 * @param {number} genreId
 * @returns {Promise<Genre>}
 */
const findGenreById = async (genreId) => {
    const genre = await Genre.findByPk(genreId);
    if (!genre) {
        throw new NotFoundError('Genre dengan ID tersebut tidak ditemukan.');
    }
    return genre;
};

/**
 * Mengupdate genre berdasarkan ID.
 * @param {number} genreId
 * @param {object} updateData
 * @returns {Promise<Genre>}
 */
const updateGenreById = async (genreId, updateData) => {
    const genre = await findGenreById(genreId);
    const newSlug = updateData.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

    // Cek duplikasi sebelum update
    const existingGenre = await Genre.findOne({
        where: {
            slug: newSlug,
            id: { [require('sequelize').Op.ne]: genreId } // Cek slug lain selain genre ini sendiri
        }
    });
    if (existingGenre) {
        throw new BadRequestError(`Genre dengan nama/slug tersebut sudah ada.`);
    }

    return await genre.update({ name: updateData.name, slug: newSlug });
};

/**
 * Menghapus genre berdasarkan ID.
 * @param {number} genreId
 * @returns {Promise<void>}
 */
const deleteGenreById = async (genreId) => {
    const genre = await findGenreById(genreId);
    await genre.destroy();
};

module.exports = {
    createGenre,
    findAllGenres,
    findGenreById,
    updateGenreById,
    deleteGenreById
};