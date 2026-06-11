const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { connectDB, sequelize } = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const perfumeRoutes = require('./routes/perfumeRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/perfumes', perfumeRoutes);
app.use('/api/orders', orderRoutes);

// Welcome route
app.get('/', (req, res) => {
  res.send('Perfume Project API is running...');
});

// Start Server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    
    // Sync models (creates tables if they don't exist)
    // In production, use migrations instead of { alter: true }
    await sequelize.sync({ alter: true });
    console.log('Models synchronized with database.');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
  }
};

startServer();
