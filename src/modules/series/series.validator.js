const { z } = require('zod');

const createSeriesSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'Judul tidak boleh kosong' }),
    author: z.string({ required_error: 'Author tidak boleh kosong' }),
    description: z.string().optional(),
    status: z.enum(['Ongoing', 'Completed', 'Hiatus'], {
      errorMap: () => ({ message: "Status harus salah satu dari: Ongoing, Completed, Hiatus" })
    }),
    type: z.enum(['manga', 'manhwa', 'manhua'], {
      errorMap: () => ({ message: "Tipe harus salah satu dari: manga, manhwa, manhua" })
    }),
  }),
});

const updateSeriesSchema = z.object({
  params: z.object({
    uuid: z.string().uuid('Format UUID tidak valid.'),
  }),
  body: z.object({
    title: z.string().optional(),
    author: z.string().optional(),
    description: z.string().optional(),
    status: z.enum(['Ongoing', 'Completed', 'Hiatus']).optional(),
    type: z.enum(['manga', 'manhwa', 'manhua']).optional(),
  }).refine((data) => Object.keys(data).length > 0, { message: "Body tidak boleh kosong. Kirim setidaknya satu field untuk di-update." }), // Memastikan body tidak kosong
});


const deleteSeriesSchema = z.object({
  params: z.object({
    uuid: z.string().uuid('Format UUID tidak valid.'),
  }),
});

const assignGenresToSeriesSchema = z.object({
  params: z.object({
    seriesUuid: z.string().uuid('Format UUID tidak valid.'),
  }),
  body: z.object({
    genreIds: z.array(z.number().int().positive()).nonempty('genreIds harus berisi setidaknya satu ID genre.'),
  }),
});

module.exports = {
    createSeriesSchema,
    updateSeriesSchema,
    deleteSeriesSchema,
    assignGenresToSeriesSchema
};