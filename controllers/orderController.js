const { Order, OrderItem, Perfume, PerfumeSize, sequelize } = require('../models');

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
      const perfume = await Perfume.findByPk(item.perfumeId, {
        include: [{ model: PerfumeSize, as: 'sizes' }]
      });
      
      if (!perfume) {
        throw new Error(`Perfume not found: ${item.perfumeId}`);
      }

      let price = 0;
      let sizeText = item.size || null;

      // Check if perfume has associated sizes
      if (perfume.sizes && perfume.sizes.length > 0) {
        // Find the matching size record from the DB
        const sizeRecord = perfume.sizes.find(s => s.size === item.size);
        if (!sizeRecord) {
          throw new Error(`Size ${item.size} not found for perfume ${perfume.name}`);
        }

        if (sizeRecord.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${perfume.name} (${item.size})`);
        }

        price = sizeRecord.price;
      } else {
        // Fallback for items without size records in PerfumeSize
        price = parseFloat(item.price) || 0;
      }

      await OrderItem.create({
        orderId: order.id,
        perfumeId: item.perfumeId,
        quantity: item.quantity,
        price,
        size: sizeText
      }, { transaction: t });
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
    const order = await Order.findByPk(req.params.id, {
      include: [{ model: OrderItem, as: 'items' }]
    });

    if (order) {
      const oldStatus = order.status;
      const newStatus = req.body.status || order.status;

      // If status is changed to shipped, reduce quantity from stock (not going below 0)
      if (newStatus === 'shipped' && oldStatus !== 'shipped') {
        const t = await sequelize.transaction();
        try {
          for (const item of order.items) {
            const perfume = await Perfume.findByPk(item.perfumeId, {
              include: [{ model: PerfumeSize, as: 'sizes' }]
            });

            if (perfume && perfume.sizes && perfume.sizes.length > 0) {
              const sizeRecord = perfume.sizes.find(s => s.size === item.size);
              if (sizeRecord) {
                sizeRecord.stock = Math.max(0, sizeRecord.stock - item.quantity);
                await sizeRecord.save({ transaction: t });
              }
            }
          }
          await t.commit();
        } catch (err) {
          await t.rollback();
          return res.status(500).json({ message: `Failed to update stock: ${err.message}` });
        }
      }

      order.status = newStatus;
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

