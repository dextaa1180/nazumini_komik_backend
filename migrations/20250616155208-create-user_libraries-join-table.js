'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_libraries', {
      // Foreign key yang menunjuk ke tabel 'users'
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      // Foreign key yang menunjuk ke tabel 'series'
      series_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'series',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Menambahkan primary key gabungan untuk mencegah user menyimpan series yang sama berkali-kali
    await queryInterface.addConstraint('user_libraries', {
      fields: ['user_id', 'series_id'],
      type: 'primary key',
      name: 'user_libraries_pkey'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('user_libraries');
  }
};