const { z } = require('zod');

const createChapterSchema = z.object({
  params: z.object({
    seriesUuid: z.string().uuid('Format UUID Series tidak valid.'),
  }),
  body: z.object({
    title: z.string().optional(),
    chapterNumber: z.coerce.number({ // coerce akan otomatis mengubah string "10.5" menjadi angka 10.5
      required_error: 'Nomor chapter tidak boleh kosong'
    }).positive('Nomor chapter harus angka positif'),
    releaseDate: z.coerce.date().optional(), // Mengubah string tanggal menjadi objek Date
  }),
});

module.exports = {
    createChapterSchema,
};