/**
 * @class SuccessResponse
 * @description Digunakan untuk membuat format respons sukses yang konsisten.
 */
class SuccessResponse {
    /**
     * @param {object} params
     * @param {any} params.data - Data yang akan dikirim.
     * @param {string} [params.message='Success'] - Pesan respons.
     * @param {number} [params.statusCode=200] - Kode status HTTP.
     */
    constructor({ data, message = 'Success', statusCode = 200 }) {
        this.success = true;
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
    }

    /**
     * Mengirimkan respons JSON ke klien.
     * @param {import('express').Response} res - Objek respons Express.
     */
    send(res) {
        res.status(this.statusCode).json({
            success: this.success,
            message: this.message,
            data: this.data,
        });
    }
}

module.exports = {
    SuccessResponse,
};