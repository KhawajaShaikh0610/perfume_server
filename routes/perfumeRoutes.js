const express = require('express');
const router = express.Router();
const { 
  getPerfumes, 
  getPerfumeById, 
  createPerfume, 
  updatePerfume, 
  deletePerfume 
} = require('../controllers/perfumeController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getPerfumes);
router.get('/:id', getPerfumeById);
router.post('/', protect, admin, createPerfume);
router.put('/:id', protect, admin, updatePerfume);
router.delete('/:id', protect, admin, deletePerfume);


module.exports = router;
