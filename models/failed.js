const { DataTypes } = require('sequelize');
const db = require('../config/db');

module.exports = db.define('Failed', {
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
        allowNull: true
    },
    updatePending: {
        type: DataTypes.DATE,
        allowNull: true
    }
},
{
    tableName: 'failed',
    timestamps: true,
    updatedAt: false,
});