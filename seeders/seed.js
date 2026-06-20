const { sequelize } = require('../config/db');
const { Category, Perfume, PerfumeSize } = require('../models');

const categories = [
  { name: 'Floral', description: 'Delicate and romantic compositions featuring rose, jasmine, iris, and other blooming flowers.' },
  { name: 'Oriental', description: 'Warm, sensual blends built around amber, vanilla, incense, and exotic spices.' },
  { name: 'Woody', description: 'Grounded and sophisticated fragrances centered on sandalwood, cedar, vetiver, and oud.' },
  { name: 'Fresh', description: 'Bright, clean, and invigorating scents with citrus, green leaves, and aquatic accords.' },
  { name: 'Gourmand', description: 'Indulgent, dessert-inspired creations with notes of caramel, chocolate, coffee, and vanilla.' },
];

const perfumes = [
  {
    name: 'OL7 Edition',
    brand: 'OL7',
    tagline: 'A Signature of Elegance',
    description: 'OL7 Edition is a vibrant and sophisticated fragrance crafted for those who embrace confidence, elegance, and everyday luxury. This captivating scent harmoniously blends sparkling citrus accords, delicate floral bouquets, refreshing green nuances, and smooth musky undertones to create a fragrance that feels both uplifting and memorable.',
    sizes: [{ size: '50ml', price: 90.00, stock: 10 }, { size: '100ml', price: 130.00, stock: 25 }],
    imageUrls: ['/ol7-edition/ol7-edition-men1.png', '/ol7-edition/ol7-edition-men2.png'],
    rating: 5.0,
    topNotes: 'Bright Citrus Accord (Bergamot, Lemon, Orange Blossom) combined with fresh green notes and juicy fruity accents.',
    heartNotes: 'Elegant floral heart featuring Rose, Jasmine, Lily of the Valley, and soft white florals enriched with fresh leafy accords.',
    baseNotes: 'Warm and comforting blend of White Musk, Amber, Sandalwood, and Tonka Bean, providing depth, smoothness, and long-lasting performance.',
    profileFloral: 70,
    profileWoody: 85,
    profileSpicy: 50,
    profileFresh: 30,
    categoryName: 'Floral',
  },
];

const seed = async () => {
  try {
    await sequelize.authenticate();
    console.log('✓ Database connected');

    // Sync models (creates/alters tables)
    await sequelize.sync();
    console.log('✓ Models synchronized');

    // Seed categories
    const categoryMap = {};
    for (const cat of categories) {
      const [record] = await Category.findOrCreate({
        where: { name: cat.name },
        defaults: cat,
      });
      categoryMap[cat.name] = record.id;
      console.log(`  ✓ Category: ${cat.name}`);
    }

    // Seed perfumes
    for (const p of perfumes) {
      const { categoryName, sizes, ...perfumeData } = p;
      perfumeData.categoryId = categoryMap[categoryName] || null;

      const [perfumeRecord] = await Perfume.findOrCreate({
        where: { name: p.name, brand: p.brand },
        defaults: perfumeData,
      });

      // Seed Sizes
      if (sizes && sizes.length > 0) {
        for (const sizeData of sizes) {
          await PerfumeSize.findOrCreate({
            where: { perfumeId: perfumeRecord.id, size: sizeData.size },
            defaults: {
              price: sizeData.price,
              stock: sizeData.stock
            }
          });
        }
      }

      console.log(`  ✓ Perfume: ${p.name}`);
    }

    console.log('\\n🎉 Seeding complete! Your database is now populated.');
    process.exit(0);
  } catch (error) {
    console.error('✗ Seeding failed:', error.message);
    process.exit(1);
  }
};

seed();
