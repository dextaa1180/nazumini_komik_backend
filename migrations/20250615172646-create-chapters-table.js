'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('chapters', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      uuid: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        unique: true,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: true, // Judul chapter bisa jadi opsional
      },
      chapter_number: {
        type: Sequelize.FLOAT, // Menggunakan FLOAT agar bisa menangani chapter 1.5 atau 20.1
        allowNull: false,
      },
      // INI BAGIAN PENTING: Kunci Asing (Foreign Key)
      series_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'series', // Menunjuk ke tabel 'series'
          key: 'id',       // Menunjuk ke kolom 'id' di tabel 'series'
        },
        onUpdate: 'CASCADE', // Jika id di series berubah, ikut berubah
        onDelete: 'CASCADE', // Jika sebuah series dihapus, semua chapternya ikut terhapus
      },
      release_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('chapters');
  },
};