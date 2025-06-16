const { z } = require('zod');

const addSeriesToLibrarySchema = z.object({
  body: z.object({
    seriesUuid: z.string().uuid('Format UUID Series tidak valid.'),
  }),
});

const removeSeriesFromLibrarySchema = z.object({
  body: z.object({
    seriesUuid: z.string().uuid('Format UUID Series tidak valid.'),
  }),
});

module.exports = {
    addSeriesToLibrarySchema,
    removeSeriesFromLibrarySchema,
};