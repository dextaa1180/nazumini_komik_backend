/**
 * Fungsi factory untuk membuat middleware validasi menggunakan skema Zod.
 * @param {import('zod').ZodSchema} schema - Skema Zod untuk validasi.
 * @returns {import('express').RequestHandler} - Middleware Express.
 */
function validate(schema) {
    return async (req, res, next) => {
        try {
            // Zod akan mem-parsing request berdasarkan skema yang diberikan.
            // Skema bisa mendefinisikan validasi untuk body, params, dan query.
            await schema.parseAsync({
                body: req.body,
                params: req.params,
                query: req.query,
            });

            // Jika validasi berhasil, lanjutkan ke handler berikutnya.
            return next();
        } catch (error) {
            // Jika validasi gagal, Zod akan melempar error.
            // Kita cukup meneruskannya ke global error handler kita.
            return next(error);
        }
    };
}

module.exports = validate;