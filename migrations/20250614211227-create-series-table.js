'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('series', { // Nama tabel 'series' (lowercase)
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
        allowNull: false,
      },
      author: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT, // Menggunakan TEXT untuk deskripsi yang panjang
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('Ongoing', 'Completed', 'Hiatus'),
        allowNull: false,
        defaultValue: 'Ongoing',
      },
      type: {
        type: Sequelize.ENUM('manga', 'manhwa', 'manhua'),
        allowNull: false,
      },
      cover_image_url: { // Menggunakan snake_case sesuai standar kita
        type: Sequelize.STRING,
        allowNull: true, // Cover bisa di-upload nanti
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
    await queryInterface.dropTable('series');
  },
};