const { DataTypes } = require('sequelize');
const db = require('../config/db');

module.exports = db.define('Pending', {
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
        defaultValue: 1
    },
    key: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    isDeprecated: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
},
{
    tableName: 'pending'
});