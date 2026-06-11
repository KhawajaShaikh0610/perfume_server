const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const PerfumeSize = sequelize.define('PerfumeSize', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    perfumeId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    size: {
        type: DataTypes.STRING, // e.g., "50ml", "100ml"
        allowNull: true
    },
    stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
});

module.exports = PerfumeSize;
