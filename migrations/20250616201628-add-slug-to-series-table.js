'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('series', 'slug', {
      type: Sequelize.STRING,
      allowNull: true, // Kita set true sementara, lalu update data yang ada
      unique: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('series', 'slug');
  }
};