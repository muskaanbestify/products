const express = require('express');
const router = express.Router();
const WomensWear = require("../models/WomensWear")
const ErrorHandler = require("../middlewares/error")


// Get all womenswear items
router.get('/', async (req, res, next) => {
    try {
      // Fetch all womenswear items from the database
      console.log("all fine")
       let womenswear = await WomensWear.find();
       console.log(womenswear);
     
    // Check if the womenswear collection is empty
      if (!womenswear || womenswear.length === 0) {
        return next(new ErrorHandler("No Women's Wear Item Found", 404));
      }

      // Send the womenswear items as the response
      res.status(200).json({
        success: true,
        count: womenswear.length,
        womensWear: womenswear, //sending the retrieved womenswear collection in response !
      });
    } catch (error) {
      console.log("An error occurred:", error.message);
      // Pass the error to the error-handling middleware
      return next(new ErrorHandler("Failed to retrieve womenswear items", 500));
    }
  });

//Get a womenswear by id
router.get('/:id', async(req,res) => {
    try {
      
      const womenswearId = req.params['id'];
  
      let womenswear  = await WomensWear.findById(womenswearId);
    
      res.json(womenswear);
  
    }
    catch (err) {
      console.log("Error:",err);
      res.status(500).json({ message: err.message });
    }
  
  })

   //Post Route
   router.post('/', async (req, res, next) => {
    try {
      console.log("Request received");
  
      const { title, description, image, affiliateLink, category, sub_category } = req.body;
      console.log("Body parsed");
  
      if (!title || !description || !image || !affiliateLink || !category || !sub_category) {
        return next(new ErrorHandler("Error! Please Fill out the Details", 400));
      }
  
      console.log("All fields are present");
  
      
      const newWomensWear = await WomensWear.create({ title, description, image, affiliateLink, category, sub_category });
      console.log("WomensWear created successfully");
  
      res.status(201).json({
        success: true,
        message: "WomensWear Created Successfully!",
        product: newWomensWear,
      });
      console.log("Response sent");
  
    } catch (error) {
      console.log("An error occurred:", error);
  
      // Handle Mongoose validation errors
      if (error.name === 'ValidationError') {
        const validationErrors = Object.values(error.errors).map(err => err.message);
        return next(new ErrorHandler(validationErrors.join(', '), 400));
      }
  
      // Handle other errors
      return next(error);
    }
  });

  // Update a womenswear by ID
  router.put('/:id', async (req, res, next) => {
    try {
      const womenswearId = req.params['id'];
      const { title, description, image, affiliateLink, category, sub_category } = req.body;

      // Find the womenswear by ID and update it with the new data
      const updatedWomensWear = await WomensWear.findByIdAndUpdate(
        womenswearId, 
        { title, description, image, affiliateLink, category, sub_category }, 
        { new: true, runValidators: true }
      );

      // If the Women's Wear is not found, return an error
      if (!updatedWomensWear) {
        return next(new ErrorHandler("Women's Wear not found", 404));
      }

      // Send the updated WomensWear in the response
      res.status(200).json({
        success: true,
        message: "WomensWear updated successfully!",
        WomensWear: updatedWomensWear,
      });
    } catch (error) {
      console.log("An error occurred:", error);

      // Handle Mongoose validation errors
      if (error.name === 'ValidationError') {
        const validationErrors = Object.values(error.errors).map(err => err.message);
        return next(new ErrorHandler(validationErrors.join(', '), 400));
      }

      // Handle other errors
      return next(error);
    }
  });

   // Delete a product by ID
   router.delete('/:id', async (req, res, next) => {
    try {
      const womenswearId = req.params['id'];
  
      // Find the womenswear by ID and delete it
      const deletedWomensWear = await WomensWear.findByIdAndDelete(womenswearId);
  
      // If the womenswear is not found, return an error
      if (!deletedWomensWear) {
        return next(new ErrorHandler("womenswear not found", 404));
      }
  
      // Send a success message
      res.status(200).json({
        success: true,
        message: "WomensWear deleted successfully!",
        product: deletedWomensWear, // Optionally returning the deleted Women's Wear details
      });
    } catch (error) {
      console.log("An error occurred:", error);
      return next(error);
    }
  });

module.exports = router;