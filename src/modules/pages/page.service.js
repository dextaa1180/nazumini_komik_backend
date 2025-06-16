const { Page } = require('./page.model');
const { Chapter } = require('../chapters/chapter.model');
const { Series } = require('../series/series.model');
const NotFoundError = require('../../errors/NotFoundError');
const BadRequestError = require('../../errors/BadRequestError');
const { uploadToCloudinary } = require('../../utils/cloudinaryUploader');

/**
 * Membuat data halaman baru, termasuk upload ke Cloudinary.
 * @param {string} chapterUuid 
 * @param {object} pageData - berisi pageNumber
 * @param {Buffer} fileBuffer - buffer gambar
 * @returns {Promise<Page>}
 */
const createPage = async (chapterUuid, pageData, fileBuffer) => {
  // 1. Cari chapter dan sertakan data series induknya untuk membuat nama folder
  const chapter = await Chapter.findOne({
    where: { uuid: chapterUuid },
    include: { model: Series, as: 'series' }
  });
  if (!chapter) {
    throw new NotFoundError('Chapter dengan ID tersebut tidak ditemukan.');
  }

  // 2. Cek duplikasi halaman di chapter yang sama
  const { pageNumber } = pageData;
  const existingPage = await Page.findOne({ where: { chapter_id: chapter.id, pageNumber } });
  if (existingPage) {
    throw new BadRequestError(`Halaman ${pageNumber} sudah ada untuk chapter ini.`);
  }

  // 3. Buat nama folder dan file yang unik untuk Cloudinary
  const seriesSlug = chapter.series.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  const folderPath = `nazumini/${seriesSlug}/chapter-${chapter.chapterNumber}`;
  const fileName = `page-${pageNumber}`;

  // 4. Panggil helper terpusat untuk melakukan upload
  const uploadResponse = await uploadToCloudinary(fileBuffer, {
    folder: folderPath,
    public_id: fileName,
  });

  // 5. Buat entri baru di database dengan URL dari Cloudinary
  const newPage = await Page.create({
    pageNumber: pageNumber,
    imageUrl: uploadResponse.secure_url,
    chapter_id: chapter.id,
  });

  return newPage;
};

/**
 * Mencari semua halaman dari sebuah chapter berdasarkan UUID chapter.
 * @param {string} chapterUuid 
 * @returns {Promise<Page[]>}
 */
const findPagesByChapterUuid = async (chapterUuid) => {
    const chapter = await Chapter.findOne({ where: { uuid: chapterUuid } });
    if (!chapter) {
        throw new NotFoundError('Chapter dengan ID tersebut tidak ditemukan.');
    }

    const pages = await Page.findAll({
        where: {
            chapter_id: chapter.id
        },
        order: [
            ['pageNumber', 'ASC']
        ]
    });

    return pages;
};

module.exports = {
  createPage,
  findPagesByChapterUuid,
};