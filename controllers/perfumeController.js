const { Perfume, Category, PerfumeSize } = require('../models');

// @desc    Get all perfumes (with category)
// @route   GET /api/perfumes
// @access  Public
const getPerfumes = async (req, res) => {
  try {
    const { categoryId } = req.query;
    const filter = categoryId ? { where: { categoryId } } : {};
    
    const perfumes = await Perfume.findAll({
      ...filter,
      include: [
        { model: Category, as: 'category', attributes: ['name'] },
        { model: PerfumeSize, as: 'sizes' }
      ]
    });
    res.json(perfumes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single perfume
// @route   GET /api/perfumes/:id
// @access  Public
const getPerfumeById = async (req, res) => {
  try {
    const perfume = await Perfume.findByPk(req.params.id, {
      include: [
        { model: Category, as: 'category' },
        { model: PerfumeSize, as: 'sizes' }
      ]
    });
    if (perfume) {
      res.json(perfume);
    } else {
      res.status(404).json({ message: 'Perfume not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a perfume
// @route   POST /api/perfumes
// @access  Private/Admin
const createPerfume = async (req, res) => {
  try {
    const { sizes, ...perfumeData } = req.body;
    
    const perfume = await Perfume.create(perfumeData);

    if (sizes && sizes.length > 0) {
      const sizeRecords = sizes.map(s => ({
        perfumeId: perfume.id,
        size: s.size,
        price: s.price,
        stock: s.stock || 0
      }));
      await PerfumeSize.bulkCreate(sizeRecords);
    }

    const createdPerfume = await Perfume.findByPk(perfume.id, {
      include: [{ model: PerfumeSize, as: 'sizes' }]
    });

    res.status(201).json(createdPerfume);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a perfume
// @route   PUT /api/perfumes/:id
// @access  Private/Admin
const updatePerfume = async (req, res) => {
  try {
    const { sizes, ...perfumeData } = req.body;
    const perfume = await Perfume.findByPk(req.params.id);

    if (perfume) {
      await perfume.update(perfumeData);
      
      // Update sizes
      if (sizes) {
        // Simple approach: delete old sizes and insert new ones
        await PerfumeSize.destroy({ where: { perfumeId: perfume.id } });
        if (sizes.length > 0) {
          const sizeRecords = sizes.map(s => ({
            perfumeId: perfume.id,
            size: s.size,
            price: s.price,
            stock: s.stock || 0
          }));
          await PerfumeSize.bulkCreate(sizeRecords);
        }
      }

      const updatedPerfume = await Perfume.findByPk(perfume.id, {
        include: [{ model: PerfumeSize, as: 'sizes' }]
      });

      res.json(updatedPerfume);
    } else {
      res.status(404).json({ message: 'Perfume not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a perfume
// @route   DELETE /api/perfumes/:id
// @access  Private/Admin
const deletePerfume = async (req, res) => {
  try {
    const perfume = await Perfume.findByPk(req.params.id);

    if (perfume) {
      await perfume.destroy(); // Cascade will delete associated sizes
      res.json({ message: 'Perfume removed' });
    } else {
      res.status(404).json({ message: 'Perfume not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPerfumes,
  getPerfumeById,
  createPerfume,
  updatePerfume,
  deletePerfume
};
