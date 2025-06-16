const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../../Store/sequelize');; // Import instance koneksi kita

const User = sequelize.define('User', {
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
    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    number: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('user', 'admin'),
        allowNull: false,
        defaultValue: 'user'
    },
}, {
    // Opsi Model
    tableName: 'users',      // 1. Wajib: Sesuaikan nama tabel ke 'users' (lowercase)
    underscored: true,       // 2. Wajib: Otomatis ubah camelCase ke snake_case (createdAt -> created_at)
    timestamps: true,        // 3. Sequelize akan mengelola 'created_at' dan 'updated_at'
    
    hooks: {
        // 4. Hook untuk hash password sebelum user dibuat
        beforeCreate: async (user, options) => {
            if (user.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        },
        // Hook jika password diupdate (opsional)
        beforeUpdate: async (user, options) => {
             if (user.changed('password')) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
             }
        }
    }
});

/**
 * 5. Instance Method untuk membandingkan password
 * @param {string} password - Password yang diinput oleh user
 * @returns {Promise<boolean>}
 */
User.prototype.isPasswordMatch = async function(password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = { User };