const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Perfume = sequelize.define('Perfume', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  tagline: {
    type: DataTypes.STRING,
    allowNull: true
  },
  imageUrls: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  videoUrls: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  rating: {
    type: DataTypes.DECIMAL(2, 1),
    defaultValue: 5.0
  },
  topNotes: {
    type: DataTypes.STRING,
    allowNull: true
  },
  heartNotes: {
    type: DataTypes.STRING,
    allowNull: true
  },
  baseNotes: {
    type: DataTypes.STRING,
    allowNull: true
  },
  profileFloral: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  profileWoody: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  profileSpicy: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  profileFresh: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'perfumes',
});

module.exports = Perfume;
