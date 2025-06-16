const genreService = require('./genre.service');
const asyncErrorHandler = require('../../errors/asyncErrorHandler');
const { SuccessResponse } = require('../../utils/apiResponse');

const createGenre = asyncErrorHandler(async (req, res, next) => {
    const newGenre = await genreService.createGenre(req.body);
    new SuccessResponse({
        statusCode: 201,
        message: 'Genre baru berhasil ditambahkan.',
        data: newGenre,
    }).send(res);
});

const getAllGenres = asyncErrorHandler(async (req, res, next) => {
    const allGenres = await genreService.findAllGenres();
    new SuccessResponse({
        message: 'Semua data genre berhasil diambil.',
        data: allGenres,
    }).send(res);
});

const updateGenre = asyncErrorHandler(async (req, res, next) => {
    const updatedGenre = await genreService.updateGenreById(req.params.id, req.body);
    new SuccessResponse({
        message: 'Genre berhasil di-update.',
        data: updatedGenre,
    }).send(res);
});

const deleteGenre = asyncErrorHandler(async (req, res, next) => {
    await genreService.deleteGenreById(req.params.id);
    res.status(204).send();
});

module.exports = {
    createGenre,
    getAllGenres,
    updateGenre,
    deleteGenre
};