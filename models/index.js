const User = require('./User');
const Category = require('./Category');
const Perfume = require('./Perfume');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const PerfumeSize = require('./PerfumeSize');
const { sequelize } = require('../config/db');

// Category & Perfume Relationship
Category.hasMany(Perfume, { foreignKey: 'categoryId', as: 'perfumes' });
Perfume.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

// User & Order Relationship (Optional for guests)
User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Order & OrderItem Relationship
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

// Perfume & OrderItem Relationship
Perfume.hasMany(OrderItem, { foreignKey: 'perfumeId', as: 'orderItems' });
OrderItem.belongsTo(Perfume, { foreignKey: 'perfumeId', as: 'perfume' });

// Perfume & PerfumeSize Relationship
Perfume.hasMany(PerfumeSize, { foreignKey: 'perfumeId', as: 'sizes', onDelete: 'CASCADE' });
PerfumeSize.belongsTo(Perfume, { foreignKey: 'perfumeId', as: 'perfume' });

module.exports = {
  User,
  Category,
  Perfume,
  PerfumeSize,
  Order,
  OrderItem,
  sequelize
};
