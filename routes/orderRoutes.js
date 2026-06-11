const express = require('express');
const router = express.Router();
const { 
  getAllOrders,
  addOrderItems, 
  getOrderById, 
  getMyOrders, 
  updateOrderStatus, 
  deleteOrder 
} = require('../controllers/orderController');
const { protect, optionalProtect, admin } = require('../middleware/authMiddleware');

router.get('/', protect, admin, getAllOrders);
router.post('/', optionalProtect, addOrderItems);
router.get('/myorders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, admin, updateOrderStatus);
router.delete('/:id', protect, admin, deleteOrder);


module.exports = router;
