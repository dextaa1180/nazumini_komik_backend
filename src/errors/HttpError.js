class HttpError extends Error {
    constructor(messege, statusCode) {
        super(messege);
        this.statusCode = statusCode;
        this.name = 'HttpError';
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = HttpError;
