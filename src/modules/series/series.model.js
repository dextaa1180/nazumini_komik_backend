const { DataTypes } = require('sequelize');
const sequelize = require('../../Store/sequelize');

const Series = sequelize.define('Series', {
    // Definisi Atribut/Kolom
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
        allowNull: false,
    },
    author: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('Ongoing', 'Completed', 'Hiatus'),
        allowNull: false,
        defaultValue: 'Ongoing',
    },
    type: {
        type: DataTypes.ENUM('manga', 'manhwa', 'manhua'),
        allowNull: false,
    },
    // Di model kita gunakan camelCase, Sequelize akan mengubahnya menjadi snake_case di database
    coverImageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    // Opsi Model
    tableName: 'series',      // Wajib: Sesuaikan nama tabel ke 'series'
    underscored: true,       // Wajib: Otomatis map camelCase ke snake_case (coverImageUrl -> cover_image_url)
    timestamps: true,        // Otomatis kelola created_at dan updated_at
});

module.exports = { Series };