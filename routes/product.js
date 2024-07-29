// const express = require('express');
// const router = express.Router();
// const Product = require('../models/Product');

// // Tokenize query and remove stop words
// const tokenize = (query) => {
//   const stopWords = ['for', 'the', 'and', 'a', 'an'];
//   return query.split(/\s+/).filter(token => !stopWords.includes(token.toLowerCase()));
// };

// // Get all products or search for products
// router.get('/', async (req, res) => {
//   try {
//     const query = req.query.q;
//     console.log('Query received:', query);  // Log the received query
//     let products;

//     if (query) {
//       const tokens = tokenize(query);
//       const regexes = tokens.map(token => new RegExp(token, 'i')); // Create regexes for each token

//       // If there's a search query, filter products by name or description
//       products = await Product.find({
//         $or: [
//           { title: { $in: regexes } }, // Case-insensitive search
//           { description: { $in: regexes } }
//         ]
//       });
//     } else {
//       // If no search query, return all products
//       products = await Product.find();
//     }

//     res.json(products);
//   } catch (err) {
//     console.error('Error:', err.message);
//     res.status(500).json({ message: err.message });
//   }
// });

// module.exports = router;














// Updated::


const express = require('express');
const axios = require('axios');
const router = express.Router();

// Tokenize query and remove stop words
const tokenize = (query) => {
  const stopWords = ['for', 'the', 'and', 'a', 'an'];
  return query.split(/\s+/).filter(token => !stopWords.includes(token.toLowerCase()));
};

// Get all products or search for products
router.get('/', async (req, res) => {
  try {
    const query = req.query.q;
    console.log('Query received:', query);  // Log the received query
    let products;

    if (query) {
      const tokens = tokenize(query);
      const regexes = tokens.map(token => new RegExp(token, 'i')); // Create regexes for each token

      // Fetch products from external API
      const response = await axios.get('https://products2-tt3o.onrender.com/api/products', {
        params: { q: query }
      });

      products = response.data;
    } else {
      // If no search query, return all products
      products = await Product.find();
    }

    res.json(products);
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
