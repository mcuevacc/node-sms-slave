const { DataTypes } = require('sequelize');
const db = require('../config/db');

module.exports = db.define('Deprecated', {
    phone: {
        type: DataTypes.STRING(9),
        allowNull: false
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false
    },
    retry: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    key: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    createPending: {
        type: DataTypes.DATE,
        allowNull: false
    },
    updatePending: {
        type: DataTypes.DATE,
        allowNull: false
    }
},
{
    tableName: 'deprecated',
    timestamps: true,
    updatedAt: false,
});