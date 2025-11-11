// update-subcategories.js
const mongoose = require('mongoose');

// Your MongoDB connection string
const MONGODB_URI = 'mongodb+srv://josephkeiyuru1:ZI5B4f1wWGpjJyiS@cluster0.2pxdxnb.mongodb.net/rekker_business'; // Update with your actual connection string

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Product = require('./models/Product'); // Update with actual path to your Product model

async function updateSubcategories() {
  try {
    console.log('🔄 Starting subcategory updates...');

    // CORNELLS - Super Foods
    await Product.updateMany(
      { category: 'super-foods', subcategory: 'shampoo' },
      { $set: { subcategory: 'super-foods-shampoo' } }
    );
    console.log('✅ Updated Super Foods Shampoo');

    await Product.updateMany(
      { category: 'super-foods', subcategory: 'conditioner' },
      { $set: { subcategory: 'super-foods-conditioner' } }
    );
    console.log('✅ Updated Super Foods Conditioner');

    await Product.updateMany(
      { category: 'super-foods', subcategory: 'hair-mask' },
      { $set: { subcategory: 'super-foods-hair-mask' } }
    );
    console.log('✅ Updated Super Foods Hair Mask');

    await Product.updateMany(
      { category: 'super-foods', subcategory: 'hair-serum' },
      { $set: { subcategory: 'super-foods-hair-serum' } }
    );
    console.log('✅ Updated Super Foods Hair Serum');

    await Product.updateMany(
      { category: 'super-foods', subcategory: 'shower-gel' },
      { $set: { subcategory: 'super-foods-shower-gel' } }
    );
    console.log('✅ Updated Super Foods Shower Gel');

    await Product.updateMany(
      { category: 'super-foods', subcategory: 'body-lotion' },
      { $set: { subcategory: 'super-foods-body-lotion' } }
    );
    console.log('✅ Updated Super Foods Body Lotion');

    await Product.updateMany(
      { category: 'super-foods', subcategory: 'body-scrub' },
      { $set: { subcategory: 'super-foods-body-scrub' } }
    );
    console.log('✅ Updated Super Foods Body Scrub');

    await Product.updateMany(
      { category: 'super-foods', subcategory: 'facial-scrub' },
      { $set: { subcategory: 'super-foods-facial-scrub' } }
    );
    console.log('✅ Updated Super Foods Facial Scrub');

    await Product.updateMany(
      { category: 'super-foods', subcategory: 'facial-mask' },
      { $set: { subcategory: 'super-foods-facial-mask' } }
    );
    console.log('✅ Updated Super Foods Facial Mask');

    await Product.updateMany(
      { category: 'super-foods', subcategory: 'face-wash' },
      { $set: { subcategory: 'super-foods-face-wash' } }
    );
    console.log('✅ Updated Super Foods Face Wash');

    await Product.updateMany(
      { category: 'super-foods', subcategory: 'facial-cream' },
      { $set: { subcategory: 'super-foods-facial-cream' } }
    );
    console.log('✅ Updated Super Foods Facial Cream');

    await Product.updateMany(
      { category: 'super-foods', subcategory: 'baby-care' },
      { $set: { subcategory: 'super-foods-baby-care' } }
    );
    console.log('✅ Updated Super Foods Baby Care');

    await Product.updateMany(
      { category: 'super-foods', subcategory: 'gift-sets' },
      { $set: { subcategory: 'super-foods-gift-sets' } }
    );
    console.log('✅ Updated Super Foods Gift Sets');

    // CORNELLS - Dark & Beautiful
    await Product.updateMany(
      { category: 'dark-beautiful', subcategory: 'shampoo' },
      { $set: { subcategory: 'dark-beautiful-shampoo' } }
    );
    console.log('✅ Updated Dark & Beautiful Shampoo');

    await Product.updateMany(
      { category: 'dark-beautiful', subcategory: 'conditioner' },
      { $set: { subcategory: 'dark-beautiful-conditioner' } }
    );
    console.log('✅ Updated Dark & Beautiful Conditioner');

    await Product.updateMany(
      { category: 'dark-beautiful', subcategory: 'styling-products' },
      { $set: { subcategory: 'dark-beautiful-styling-products' } }
    );
    console.log('✅ Updated Dark & Beautiful Styling Products');

    await Product.updateMany(
      { category: 'dark-beautiful', subcategory: 'hair-treatments' },
      { $set: { subcategory: 'dark-beautiful-hair-treatments' } }
    );
    console.log('✅ Updated Dark & Beautiful Hair Treatments');

    await Product.updateMany(
      { category: 'dark-beautiful', subcategory: 'oils-serums' },
      { $set: { subcategory: 'dark-beautiful-oils-serums' } }
    );
    console.log('✅ Updated Dark & Beautiful Oils & Serums');

    await Product.updateMany(
      { category: 'dark-beautiful', subcategory: 'kids-hair-care' },
      { $set: { subcategory: 'dark-beautiful-kids-hair-care' } }
    );
    console.log('✅ Updated Dark & Beautiful Kids Hair Care');

    // CORNELLS - Bold & Beautiful
    await Product.updateMany(
      { category: 'bold-beautiful', subcategory: 'shampoo' },
      { $set: { subcategory: 'bold-beautiful-shampoo' } }
    );
    console.log('✅ Updated Bold & Beautiful Shampoo');

    await Product.updateMany(
      { category: 'bold-beautiful', subcategory: 'conditioner' },
      { $set: { subcategory: 'bold-beautiful-conditioner' } }
    );
    console.log('✅ Updated Bold & Beautiful Conditioner');

    await Product.updateMany(
      { category: 'bold-beautiful', subcategory: 'body-cream' },
      { $set: { subcategory: 'bold-beautiful-body-cream' } }
    );
    console.log('✅ Updated Bold & Beautiful Body Cream');

    await Product.updateMany(
      { category: 'bold-beautiful', subcategory: 'body-lotion' },
      { $set: { subcategory: 'bold-beautiful-body-lotion' } }
    );
    console.log('✅ Updated Bold & Beautiful Body Lotion');

    await Product.updateMany(
      { category: 'bold-beautiful', subcategory: 'shower-gel' },
      { $set: { subcategory: 'bold-beautiful-shower-gel' } }
    );
    console.log('✅ Updated Bold & Beautiful Shower Gel');

    await Product.updateMany(
      { category: 'bold-beautiful', subcategory: 'body-scrub' },
      { $set: { subcategory: 'bold-beautiful-body-scrub' } }
    );
    console.log('✅ Updated Bold & Beautiful Body Scrub');

    await Product.updateMany(
      { category: 'bold-beautiful', subcategory: 'shower-scrub' },
      { $set: { subcategory: 'bold-beautiful-shower-scrub' } }
    );
    console.log('✅ Updated Bold & Beautiful Shower Scrub');

    await Product.updateMany(
      { category: 'bold-beautiful', subcategory: 'hand-body-lotion' },
      { $set: { subcategory: 'bold-beautiful-hand-body-lotion' } }
    );
    console.log('✅ Updated Bold & Beautiful Hand & Body Lotion');

    await Product.updateMany(
      { category: 'bold-beautiful', subcategory: 'body-butter' },
      { $set: { subcategory: 'bold-beautiful-body-butter' } }
    );
    console.log('✅ Updated Bold & Beautiful Body Butter');

    await Product.updateMany(
      { category: 'bold-beautiful', subcategory: 'body-oil' },
      { $set: { subcategory: 'bold-beautiful-body-oil' } }
    );
    console.log('✅ Updated Bold & Beautiful Body Oil');

    await Product.updateMany(
      { category: 'bold-beautiful', subcategory: 'moisturizer' },
      { $set: { subcategory: 'bold-beautiful-moisturizer' } }
    );
    console.log('✅ Updated Bold & Beautiful Moisturizer');

    await Product.updateMany(
      { category: 'bold-beautiful', subcategory: 'sugar-scrub' },
      { $set: { subcategory: 'bold-beautiful-sugar-scrub' } }
    );
    console.log('✅ Updated Bold & Beautiful Sugar Scrub');

    await Product.updateMany(
      { category: 'bold-beautiful', subcategory: 'facial-care' },
      { $set: { subcategory: 'bold-beautiful-facial-care' } }
    );
    console.log('✅ Updated Bold & Beautiful Facial Care');

    await Product.updateMany(
      { category: 'bold-beautiful', subcategory: 'serums' },
      { $set: { subcategory: 'bold-beautiful-serums' } }
    );
    console.log('✅ Updated Bold & Beautiful Serums');

    await Product.updateMany(
      { category: 'bold-beautiful', subcategory: 'deodorant' },
      { $set: { subcategory: 'bold-beautiful-deodorant' } }
    );
    console.log('✅ Updated Bold & Beautiful Anti-Perspirant');

    await Product.updateMany(
      { category: 'bold-beautiful', subcategory: 'day-night-cream' },
      { $set: { subcategory: 'bold-beautiful-day-night-cream' } }
    );
    console.log('✅ Updated Bold & Beautiful Day & Night Cream');

    // CORNELLS - Cute & Pretty
    await Product.updateMany(
      { category: 'cute-pretty', subcategory: 'shampoo' },
      { $set: { subcategory: 'cute-pretty-shampoo' } }
    );
    console.log('✅ Updated Cute & Pretty Shampoo');

    await Product.updateMany(
      { category: 'cute-pretty', subcategory: 'conditioner' },
      { $set: { subcategory: 'cute-pretty-conditioner' } }
    );
    console.log('✅ Updated Cute & Pretty Conditioner');

    await Product.updateMany(
      { category: 'cute-pretty', subcategory: 'baby-wash-shampoo' },
      { $set: { subcategory: 'cute-pretty-baby-wash-shampoo' } }
    );
    console.log('✅ Updated Cute & Pretty Baby Wash & Shampoo');

    await Product.updateMany(
      { category: 'cute-pretty', subcategory: 'baby-lotion' },
      { $set: { subcategory: 'cute-pretty-baby-lotion' } }
    );
    console.log('✅ Updated Cute & Pretty Baby Lotion');

    await Product.updateMany(
      { category: 'cute-pretty', subcategory: 'baby-oil' },
      { $set: { subcategory: 'cute-pretty-baby-oil' } }
    );
    console.log('✅ Updated Cute & Pretty Baby Oil');

    await Product.updateMany(
      { category: 'cute-pretty', subcategory: 'baby-cream' },
      { $set: { subcategory: 'cute-pretty-baby-cream' } }
    );
    console.log('✅ Updated Cute & Pretty Baby Cream');

    await Product.updateMany(
      { category: 'cute-pretty', subcategory: 'nappy-rash-cream' },
      { $set: { subcategory: 'cute-pretty-nappy-rash-cream' } }
    );
    console.log('✅ Updated Cute & Pretty Nappy Rash Cream');

    await Product.updateMany(
      { category: 'cute-pretty', subcategory: 'kids-shampoo' },
      { $set: { subcategory: 'cute-pretty-kids-shampoo' } }
    );
    console.log('✅ Updated Cute & Pretty Kids Shampoo');

    await Product.updateMany(
      { category: 'cute-pretty', subcategory: 'kids-conditioner' },
      { $set: { subcategory: 'cute-pretty-kids-conditioner' } }
    );
    console.log('✅ Updated Cute & Pretty Kids Conditioner');

    await Product.updateMany(
      { category: 'cute-pretty', subcategory: 'kids-styling' },
      { $set: { subcategory: 'cute-pretty-kids-styling' } }
    );
    console.log('✅ Updated Cute & Pretty Kids Styling');

    await Product.updateMany(
      { category: 'cute-pretty', subcategory: 'kids-treatments' },
      { $set: { subcategory: 'cute-pretty-kids-treatments' } }
    );
    console.log('✅ Updated Cute & Pretty Kids Treatments');

    // SAFFRON - Home Care & Hygiene
    await Product.updateMany(
      { category: 'home-care-hygiene', subcategory: 'handwash' },
      { $set: { subcategory: 'home-care-hygiene-handwash' } }
    );
    console.log('✅ Updated Saffron Home Care Handwash');

    await Product.updateMany(
      { category: 'home-care-hygiene', subcategory: 'dishwashing' },
      { $set: { subcategory: 'home-care-hygiene-dishwashing' } }
    );
    console.log('✅ Updated Saffron Home Care Dishwashing');

    await Product.updateMany(
      { category: 'home-care-hygiene', subcategory: 'detergent' },
      { $set: { subcategory: 'home-care-hygiene-detergent' } }
    );
    console.log('✅ Updated Saffron Home Care Detergent');

    // SAFFRON - Beauty & Body Care
    await Product.updateMany(
      { category: 'beauty-body-care', subcategory: 'shower-gel' },
      { $set: { subcategory: 'beauty-body-care-shower-gel' } }
    );
    console.log('✅ Updated Saffron Beauty & Body Shower Gel');

    await Product.updateMany(
      { category: 'beauty-body-care', subcategory: 'aftershave' },
      { $set: { subcategory: 'beauty-body-care-aftershave' } }
    );
    console.log('✅ Updated Saffron Beauty & Body After-Shave');

    console.log('🎉 All subcategory updates completed!');
    
    // Verify the updates
    const updatedCounts = {
      'super-foods-shampoo': await Product.countDocuments({ subcategory: 'super-foods-shampoo' }),
      'dark-beautiful-shampoo': await Product.countDocuments({ subcategory: 'dark-beautiful-shampoo' }),
      'bold-beautiful-shampoo': await Product.countDocuments({ subcategory: 'bold-beautiful-shampoo' }),
      'cute-pretty-shampoo': await Product.countDocuments({ subcategory: 'cute-pretty-shampoo' }),
    };
    
    console.log('📊 Verification counts:', updatedCounts);

  } catch (error) {
    console.error('❌ Error updating subcategories:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

updateSubcategories();