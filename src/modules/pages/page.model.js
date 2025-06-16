const { DataTypes } = require('sequelize');
const sequelize = require('../../Store/sequelize');

const Page = sequelize.define('Page', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
    },
    pageNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    // chapter_id akan dibuat otomatis oleh Sequelize saat kita definisikan hubungan
}, {
    tableName: 'pages',
    underscored: true, // Otomatis map pageNumber -> page_number, imageUrl -> image_url, etc.
    timestamps: true,
});

module.exports = { Page };