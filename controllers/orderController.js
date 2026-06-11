const { Order, OrderItem, Perfume, sequelize } = require('../models');

// @desc    Get all orders (admin)
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: OrderItem, as: 'items', include: [{ model: Perfume, as: 'perfume' }] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Public (Guest or User)
const addOrderItems = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      totalAmount,
      // Guest info
      customerName,
      customerEmail,
      customerPhone
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // Create order header
    const order = await Order.create({
      userId: req.user ? req.user.id : null, // req.user comes from auth middleware
      totalAmount,
      shippingAddress,
      paymentMethod: paymentMethod || 'cash',
      customerName: req.user ? req.user.name : customerName,
      customerEmail: req.user ? req.user.email : customerEmail,
      customerPhone: req.user ? req.user.phone : customerPhone
    }, { transaction: t });

    // Create order items
    for (const item of orderItems) {
      const perfume = await Perfume.findByPk(item.perfumeId);
      
      if (!perfume) {
        throw new Error(`Perfume not found: ${item.perfumeId}`);
      }

      if (perfume.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${perfume.name}`);
      }

      await OrderItem.create({
        orderId: order.id,
        perfumeId: item.perfumeId,
        quantity: item.quantity,
        price: perfume.price // Use current price from DB
      }, { transaction: t });

      // Update stock
      perfume.stock -= item.quantity;
      await perfume.save({ transaction: t });
    }

    await t.commit();
    res.status(201).json(order);
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        { model: OrderItem, as: 'items', include: [{ model: Perfume, as: 'perfume' }] }
      ]
    });

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: [
        { model: OrderItem, as: 'items', include: [{ model: Perfume, as: 'perfume' }] }
      ]
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);

    if (order) {
      order.status = req.body.status || order.status;
      order.paymentStatus = req.body.paymentStatus || order.paymentStatus;

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);

    if (order) {
      await order.destroy();
      res.json({ message: 'Order removed' });
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllOrders,
  addOrderItems,
  getOrderById,
  getMyOrders,
  updateOrderStatus,
  deleteOrder
};

