const cloudinary = require('../config/cloudinary');

/**
 * Upload file buffer ke Cloudinary dengan opsi.
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

module.exports = { uploadToCloudinary };