const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  updateUserProfile, 
  deleteUser,
  adminLogin
} = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/admin-login', adminLogin);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.delete('/:id', protect, admin, deleteUser);


module.exports = router;
