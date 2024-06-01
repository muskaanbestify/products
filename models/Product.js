const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  details: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  affiliateLink: {
    type: String,
    required: true 
  },
  category: {
    type: String,
    required: true
  }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
