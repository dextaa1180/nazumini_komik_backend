const HttpError = require('./HttpError');

class ServerError extends HttpError {
    constructor(message) {
        super(message, 500);
        this.name = "ServerError";
    }
}

module.exports = ServerError;