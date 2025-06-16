const { Page } = require('./page.model');
const { Chapter } = require('../chapters/chapter.model');
const { Series } = require('../series/series.model');
const NotFoundError = require('../../errors/NotFoundError');
const BadRequestError = require('../../errors/BadRequestError');
const cloudinary = require('../../config/cloudinary');

/**
 * Upload file buffer ke Cloudinary dengan opsi yang jelas.
 * @param {Buffer} buffer 
 * @param {object} options - Opsi upload untuk Cloudinary (folder & public_id)
 * @returns {Promise<object>}
 */
const uploadToCloudinary = (buffer, options) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { ...options, resource_type: 'image' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
};

/**
 * Membuat data halaman baru, termasuk upload ke Cloudinary.
 * @param {string} chapterUuid 
 * @param {object} pageData - berisi pageNumber
 * @param {Buffer} fileBuffer - buffer gambar
 * @returns {Promise<Page>}
 */
const createPage = async (chapterUuid, pageData, fileBuffer) => {
  // 1. Cari chapter dan sertakan data series induknya
  const chapter = await Chapter.findOne({
    where: { uuid: chapterUuid },
    include: { model: Series, as: 'series' }
  });
  if (!chapter) {
    throw new NotFoundError('Chapter dengan ID tersebut tidak ditemukan.');
  }

  // 2. Cek duplikasi halaman
  const { pageNumber } = pageData;
  const existingPage = await Page.findOne({ where: { chapter_id: chapter.id, pageNumber } });
  if (existingPage) {
    throw new BadRequestError(`Halaman ${pageNumber} sudah ada untuk chapter ini.`);
  }

  // 3. PISAHKAN LOGIKA FOLDER DAN NAMA FILE
  const seriesSlug = chapter.series.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  const folderPath = `nazumini/${seriesSlug}/chapter-${chapter.chapterNumber}`;
  const fileName = `page-${pageNumber}`;

  // 4. Lakukan upload ke Cloudinary dengan opsi yang eksplisit
  const uploadResponse = await uploadToCloudinary(fileBuffer, {
    folder: folderPath,
    public_id: fileName,
  });

  // 5. Buat entri di database
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
    // 1. Validasi dulu apakah chapternya ada
    const chapter = await Chapter.findOne({ where: { uuid: chapterUuid } });
    if (!chapter) {
        throw new NotFoundError('Chapter dengan ID tersebut tidak ditemukan.');
    }

    // 2. Cari semua halaman yang terhubung dengan chapter_id tersebut
    const pages = await Page.findAll({
        where: {
            chapter_id: chapter.id
        },
        order: [
            ['pageNumber', 'ASC'] // Urutkan berdasarkan nomor halaman, dari kecil ke besar
        ]
    });

    return pages;
};

module.exports = {
  createPage,
  findPagesByChapterUuid
}