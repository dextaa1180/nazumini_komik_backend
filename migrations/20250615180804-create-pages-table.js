'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('pages', {
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
      page_number: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      image_url: {
        type: Sequelize.STRING, // Akan berisi URL dari Cloudinary
        allowNull: false,
      },
      // Kunci Asing untuk menghubungkan ke tabel 'chapters'
      chapter_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'chapters',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE', // Jika chapter dihapus, semua halamannya ikut terhapus
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
    await queryInterface.dropTable('pages');
  },
};