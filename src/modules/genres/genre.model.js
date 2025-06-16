const { DataTypes } = require('sequelize');
const sequelize = require('../../Store/sequelize');

const Genre = sequelize.define('Genre', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
}, {
    tableName: 'genres',
    underscored: true,
    timestamps: true,
});

module.exports = { Genre };