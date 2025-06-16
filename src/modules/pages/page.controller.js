const pageService = require('./page.service');
const asyncErrorHandler = require('../../errors/asyncErrorHandler');
const { SuccessResponse } = require('../../utils/apiResponse');
const BadRequestError = require('../../errors/BadRequestError');

const createPage = asyncErrorHandler(async (req, res, next) => {
    const { chapterUuid } = req.params;
    const { pageNumber } = req.body;

    if (!req.file) {
      throw new BadRequestError('Gambar halaman tidak boleh kosong.');
    }
    if (!pageNumber) {
      throw new BadRequestError('Nomor halaman tidak boleh kosong.');
    }

    // Serahkan semua logika ke service
    const newPage = await pageService.createPage(
      chapterUuid,
      { pageNumber: parseInt(pageNumber, 10) },
      req.file.buffer
    );

    new SuccessResponse({
        statusCode: 201,
        message: 'Halaman baru berhasil di-upload dan ditambahkan.',
        data: newPage,
    }).send(res);
});

/**
 * Controller untuk mengambil semua halaman dari sebuah chapter.
 */
const getAllPagesForChapter = asyncErrorHandler(async (req, res, next) => {
    const { chapterUuid } = req.params;
    const pages = await pageService.findPagesByChapterUuid(chapterUuid);

    new SuccessResponse({
        message: 'Daftar halaman untuk chapter berhasil diambil.',
        data: pages,
    }).send(res);
});

module.exports = {
  createPage,
  getAllPagesForChapter
};