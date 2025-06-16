const multer = require('multer');

// Kita akan menyimpan file sementara di memori server sebelum di-upload ke Cloudinary
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // Batas ukuran file 5 MB
    }
});

module.exports = upload;