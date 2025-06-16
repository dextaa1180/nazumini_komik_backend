const { z } = require('zod');

const createGenreSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Nama genre tidak boleh kosong' })
      .min(3, 'Nama genre minimal 3 karakter'),
  }),
});

const updateGenreSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(), // coerce mengubah string dari URL menjadi angka
  }),
  body: z.object({
    name: z.string().min(3, 'Nama genre minimal 3 karakter'),
  }),
});

const deleteGenreSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
});

module.exports = {
    createGenreSchema,
    updateGenreSchema,
    deleteGenreSchema
};