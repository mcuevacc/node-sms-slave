const { DataTypes } = require('sequelize');
const db = require('../config/db');

module.exports = db.define('Sended', {
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
        allowNull: false,
        defaultValue: 0
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
    tableName: 'sended',
    timestamps: true,
    updatedAt: false,
});