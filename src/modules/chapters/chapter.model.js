const { DataTypes } = require('sequelize');
const sequelize = require('../../Store/sequelize');

const Chapter = sequelize.define('Chapter', {
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
    title: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    chapterNumber: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    releaseDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    // series_id akan dibuat otomatis oleh Sequelize saat kita definisikan hubungan
}, {
    tableName: 'chapters',
    underscored: true,
    timestamps: true,
});

module.exports = { Chapter };