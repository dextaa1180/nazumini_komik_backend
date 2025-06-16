const { User } = require('../modules/user/user.model');
const { Series } = require('../modules/series/series.model');
const { Chapter } = require('../modules/chapters/chapter.model');
const { Page } = require('../modules/pages/page.model')
const { Genre } = require('../modules/genres/genre.model');

// --- Hubungan Series dan Chapter (One-to-Many) ---
// 1 Series memiliki banyak Chapter
Series.hasMany(Chapter, {
  foreignKey: 'series_id', // Ini adalah nama kolom di tabel 'chapters'
  as: 'chapters'         // Nama alias saat kita mengambil data chapters dari series
});

// 1 Chapter hanya milik 1 Series
Chapter.belongsTo(Series, {
  foreignKey: 'series_id',
  as: 'series'
});

// --- Hubungan Chapter dan Page (One-to-Many) ---
Chapter.hasMany(Page, {
  foreignKey: 'chapter_id',
  as: 'pages' // Alias ini akan berguna saat kita mengambil data
});
Page.belongsTo(Chapter, {
  foreignKey: 'chapter_id',
  as: 'chapter'
});

// --- Hubungan Series dan Genre (Many-to-Many) ---
Series.belongsToMany(Genre, {
    through: 'series_genres', // Nama tabel penghubung
    foreignKey: 'series_id',
    as: 'genres'
});

Genre.belongsToMany(Series, {
    through: 'series_genres',
    foreignKey: 'genre_id',
    as: 'series'
});

// --- Hubungan User dan Series (Many-to-Many untuk Library) ---
User.belongsToMany(Series, {
  through: 'user_libraries', // Nama tabel penghubung
  foreignKey: 'user_id',
  as: 'library' // Saat kita ambil data user, koleksinya kita sebut 'library'
});

Series.belongsToMany(User, {
  through: 'user_libraries',
  foreignKey: 'series_id',
  as: 'bookmarkedBy' // Saat kita ambil data series, kita bisa lihat siapa saja yg me-bookmark
});

// --- Hubungan lain bisa ditambahkan di sini nanti ---
// Contoh:
// User.hasMany(Comment, { foreignKey: 'user_id' });
// Comment.belongsTo(User, { foreignKey: 'user_id' });

console.log('🔗 Relasi antar model berhasil didefinisikan.');