// Memastikan semua variabel .env dimuat pertama kali
require('dotenv').config(); 

// Mengimpor SELURUH aplikasi Express yang sudah kita konfigurasi dari file app.js
const app = require('./app'); 

// Mengambil port dari file .env, dengan default 5000 jika tidak ditemukan
const PORT = process.env.SERVER_PORT || 5000;

// Menjalankan server dengan aplikasi yang sudah lengkap
app.listen(PORT, () => {
    console.log(`🚀 Server berjalan di port ${PORT}...`);
    // Kita juga akan melihat pesan "✅ Koneksi ke database berhasil." dari file sequelize.js
});