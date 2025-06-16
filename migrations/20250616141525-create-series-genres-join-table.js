'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('series_genres', {
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
      genre_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'genres',
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

    // Menambahkan primary key gabungan untuk mencegah duplikasi
    await queryInterface.addConstraint('series_genres', {
      fields: ['series_id', 'genre_id'],
      type: 'primary key',
      name: 'series_genres_pkey'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('series_genres');
  }
};