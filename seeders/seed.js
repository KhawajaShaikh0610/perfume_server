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
  // {
  //   name: "Fleur d'Orchidée",
  //   brand: 'OL7',
  //   tagline: 'Solar orchids and warm vanilla whispers',
  //   description: 'A delicate and radiant harmony where solar orchid flowers blend with warm vanilla and soft musk, capturing the essence of a sunlit garden.',
  //   sizes: [{ size: '50ml', price: 85.00, stock: 15 }, { size: '100ml', price: 120.00, stock: 30 }],
  //   imageUrls: ['https://images.unsplash.com/photo-1613521140785-e85e427f8002?q=80&w=1200&auto=format&fit=crop'],
  //   rating: 4.8,
  //   topNotes: 'Neroli, Sweet Bergamot',
  //   heartNotes: 'Solar Orchid, Golden Ylang-Ylang',
  //   baseNotes: 'Vanilla Absolute, Soft Musk',
  //   profileFloral: 90,
  //   profileWoody: 35,
  //   profileSpicy: 15,
  //   profileFresh: 75,
  //   categoryName: 'Floral',
  // },
  // {
  //   name: 'Tubéreuse Blanche',
  //   brand: 'OL7',
  //   tagline: 'Intoxicating, creamy white floral velvet',
  //   description: 'An intoxicating and creamy white floral composition, featuring rich tubereuse absolute layered with jasmine petals and a base of smooth coconut wood.',
  //   sizes: [{ size: '100ml', price: 118.00, stock: 20 }],
  //   imageUrls: ['https://images.unsplash.com/photo-1610113233329-1c73b6f7fe98?q=80&w=1200&auto=format&fit=crop'],
  //   rating: 4.9,
  //   topNotes: 'Green Leaves, Juicy Pear',
  //   heartNotes: 'Tuberose Absolute, Night-Blooming Jasmine',
  //   baseNotes: 'Coconut Wood, Clean White Musk',
  //   profileFloral: 95,
  //   profileWoody: 25,
  //   profileSpicy: 10,
  //   profileFresh: 50,
  //   categoryName: 'Floral',
  // },
  // {
  //   name: 'Magnolia Cendrée',
  //   brand: 'OL7',
  //   tagline: 'Velvet petals wrapped in mysterious smoke',
  //   description: 'A mysterious, smoky-floral fragrance. Velvet magnolia petals are contrasted with cold incense smoke and deep cedarwood, leaving a subtle, lingering trail.',
  //   sizes: [{ size: '100ml', price: 120.00, stock: 18 }],
  //   imageUrls: ['https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1200&auto=format&fit=crop'],
  //   rating: 4.7,
  //   topNotes: 'Saffron Flower, Crushed Black Pepper',
  //   heartNotes: 'Velvet Magnolia, Cold Frankincense',
  //   baseNotes: 'Smoky Cedarwood, White Amber',
  //   profileFloral: 65,
  //   profileWoody: 80,
  //   profileSpicy: 65,
  //   profileFresh: 25,
  //   categoryName: 'Woody',
  // },
  // {
  //   name: 'Nuit de Jasmin',
  //   brand: 'OL7',
  //   tagline: 'Nocturnal jasmine blooming in shadows',
  //   description: 'A nocturnal, seductive fragrance capturing night-blooming jasmine under a starry sky, balanced by warm ambergris and dark patchouli.',
  //   sizes: [{ size: '100ml', price: 126.00, stock: 22 }],
  //   imageUrls: ['https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1200&auto=format&fit=crop'],
  //   rating: 4.9,
  //   topNotes: 'Bitter Orange Blossom, Cardamom',
  //   heartNotes: 'Night-Blooming Jasmine, Damask Rose',
  //   baseNotes: 'Warm Ambergris, Dark Patchouli, Sandalwood',
  //   profileFloral: 85,
  //   profileWoody: 45,
  //   profileSpicy: 40,
  //   profileFresh: 45,
  //   categoryName: 'Oriental',
  // },
  // {
  //   name: 'Ambre Sauvage',
  //   brand: 'OL7',
  //   tagline: 'Untamed amber in a velvet embrace',
  //   description: 'A bold, animalic amber fragrance that balances raw power with refined elegance. Smoky labdanum and wild honey intertwine with leather and benzoin.',
  //   sizes: [{ size: '50ml', price: 100.00, stock: 5 }, { size: '100ml', price: 145.00, stock: 15 }],
  //   imageUrls: ['https://images.unsplash.com/photo-1595535373192-fc8935bacd89?q=80&w=1200&auto=format&fit=crop'],
  //   rating: 4.8,
  //   topNotes: 'Wild Honey, Saffron',
  //   heartNotes: 'Labdanum, Leather Accord',
  //   baseNotes: 'Benzoin, Tonka Bean, Dark Musk',
  //   profileFloral: 15,
  //   profileWoody: 70,
  //   profileSpicy: 80,
  //   profileFresh: 10,
  //   categoryName: 'Oriental',
  // },
  // {
  //   name: 'Bois de Cèdre',
  //   brand: 'OL7',
  //   tagline: 'Ancient cedarwood wrapped in silver mist',
  //   description: 'A timeless woody composition inspired by ancient cedar forests at dawn. Crisp aldehydes open into a heart of atlas cedarwood and guaiac, settling on a bed of cool vetiver.',
  //   sizes: [{ size: '100ml', price: 135.00, stock: 28 }],
  //   imageUrls: ['https://images.unsplash.com/photo-1587017539504-67cfbddac569?q=80&w=1200&auto=format&fit=crop'],
  //   rating: 4.6,
  //   topNotes: 'Aldehydes, Green Cardamom',
  //   heartNotes: 'Atlas Cedarwood, Guaiac Wood',
  //   baseNotes: 'Vetiver, White Musk, Moss',
  //   profileFloral: 10,
  //   profileWoody: 95,
  //   profileSpicy: 30,
  //   profileFresh: 45,
  //   categoryName: 'Woody',
  // },
  // {
  //   name: 'Citron Méditerranée',
  //   brand: 'OL7',
  //   tagline: 'Sun-drenched citrus groves by the sea',
  //   description: 'A luminous, sparkling citrus fragrance that captures the spirit of Mediterranean mornings. Bright lemon and bergamot dance over aromatic herbs and crystalline musk.',
  //   sizes: [{ size: '100ml', price: 98.00, stock: 35 }],
  //   imageUrls: ['https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1200&auto=format&fit=crop'],
  //   rating: 4.5,
  //   topNotes: 'Sicilian Lemon, Bergamot, Grapefruit',
  //   heartNotes: 'Rosemary, Neroli, Sea Salt',
  //   baseNotes: 'Crystalline Musk, Driftwood',
  //   profileFloral: 20,
  //   profileWoody: 15,
  //   profileSpicy: 10,
  //   profileFresh: 95,
  //   categoryName: 'Fresh',
  // },
  // {
  //   name: 'Vanille Impériale',
  //   brand: 'OL7',
  //   tagline: 'Opulent vanilla kissed with caramel gold',
  //   description: 'An indulgent, gourmand masterpiece. Madagascar vanilla orchid is enveloped in salted caramel, roasted coffee, and a whisper of dark rum, creating an irresistible warmth.',
  //   sizes: [{ size: '100ml', price: 140.00, stock: 12 }],
  //   imageUrls: ['https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=1200&auto=format&fit=crop'],
  //   rating: 4.9,
  //   topNotes: 'Roasted Coffee, Bitter Almond',
  //   heartNotes: 'Madagascar Vanilla, Salted Caramel',
  //   baseNotes: 'Dark Rum, Sandalwood, Tonka',
  //   profileFloral: 10,
  //   profileWoody: 30,
  //   profileSpicy: 25,
  //   profileFresh: 5,
  //   categoryName: 'Gourmand',
  // },
  // {
  //   name: 'Oud Royale',
  //   brand: 'OL7',
  //   tagline: 'Liquid gold from ancient forests',
  //   description: 'A majestic oud fragrance of unparalleled depth. Rare oud from Assam is mellowed with Bulgarian rose and saffron, resting on a throne of aged sandalwood and musk.',
  //   sizes: [{ size: '50ml', price: 195.00, stock: 8 }],
  //   imageUrls: ['https://images.unsplash.com/photo-1563170351-be82bc888aa4?q=80&w=1200&auto=format&fit=crop'],
  //   rating: 5.0,
  //   topNotes: 'Royal Saffron, Pink Pepper',
  //   heartNotes: 'Oud Assam, Bulgarian Rose',
  //   baseNotes: 'Aged Sandalwood, Ambergris, Musk',
  //   profileFloral: 30,
  //   profileWoody: 95,
  //   profileSpicy: 70,
  //   profileFresh: 5,
  //   categoryName: 'Woody',
  // },
  // {
  //   name: 'Rose Éternelle',
  //   brand: 'OL7',
  //   tagline: 'A timeless rose that never fades',
  //   description: 'An exquisitely crafted rose soliflore. Centifolia rose from Grasse is layered with Damascena petals, wrapped in soft suede and dusted with powdery iris.',
  //   sizes: [{ size: '100ml', price: 155.00, stock: 16 }],
  //   imageUrls: ['https://images.unsplash.com/photo-1608528577891-eb055944f2e7?q=80&w=1200&auto=format&fit=crop'],
  //   rating: 4.8,
  //   topNotes: 'Litchi, Pink Pepper, Bergamot',
  //   heartNotes: 'Centifolia Rose, Damascena Rose, Peony',
  //   baseNotes: 'Soft Suede, Iris Butter, White Cedar',
  //   profileFloral: 98,
  //   profileWoody: 20,
  //   profileSpicy: 15,
  //   profileFresh: 40,
  //   categoryName: 'Floral',
  // },
  // {
  //   name: 'Thé Vert Impérial',
  //   brand: 'OL7',
  //   tagline: 'Serene green tea in a zen garden',
  //   description: 'A meditative, clean fragrance inspired by Japanese tea ceremony. Steamed green tea accord mingles with dewy bamboo and sheer jasmine, over a calming base of white woods.',
  //   sizes: [{ size: '100ml', price: 105.00, stock: 40 }],
  //   imageUrls: ['https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?q=80&w=1200&auto=format&fit=crop'],
  //   rating: 4.6,
  //   topNotes: 'Green Tea, Yuzu, Mint',
  //   heartNotes: 'Bamboo, Sheer Jasmine',
  //   baseNotes: 'White Woods, Clean Musk, Matcha',
  //   profileFloral: 25,
  //   profileWoody: 20,
  //   profileSpicy: 5,
  //   profileFresh: 90,
  //   categoryName: 'Fresh',
  // },
];

const seed = async () => {
  try {
    await sequelize.authenticate();
    console.log('✓ Database connected');

    // Sync models (creates/alters tables)
    await sequelize.sync({ alter: true });
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
