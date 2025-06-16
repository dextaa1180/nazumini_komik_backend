'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Perintah untuk menambahkan kolom 'role' ke tabel 'users'
    await queryInterface.addColumn('users', 'role', {
      type: Sequelize.ENUM('user', 'admin'),
      allowNull: false,
      defaultValue: 'user'
    });
  },

  async down(queryInterface, Sequelize) {
    // Perintah untuk menghapus kolom 'role' jika migrasi di-rollback
    await queryInterface.removeColumn('users', 'role');
  }
};