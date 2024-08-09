const mongoose = require("mongoose")

const mensWearSchema = new mongoose.Schema({
    
  title: {
    type: String,
    required: true,
    index: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
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
  },
    sub_category: {
    type: String,
  },
})

const MensWear = mongoose.model("MensWear", mensWearSchema);
module.exports = MensWear;