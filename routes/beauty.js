const express = require('express');
const router = express.Router();
const Beauty = require("../models/Beauty")
const ErrorHandler = require("../middlewares/error")


// Get all beauty items
router.get('/', async (req, res, next) => {
    try {
      // Fetch all beauty items from the database
      console.log("all fine")
       let beauty = await Beauty.find();
       console.log(beauty)
     
    // Check if the beauty collection is empty
      if (!beauty || beauty.length === 0) {
        return next(new ErrorHandler("No Beauty items found", 404));
      }

      // Send the beauty items as the response
      res.status(200).json({
        success: true,
        count: beauty.length,
        beauty: beauty, //sending the retrieved beauty collection in response !
      });
    } catch (error) {
      console.log("An error occurred:", error.message);
      // Pass the error to the error-handling middleware
      return next(new ErrorHandler("Failed to retrieve beauty items", 500));
    }
  });

  //Get a beauty Item by id

router.get('/:id', async(req,res) => {
    try {
      
      const beautyId = req.params['id'];
  
      let beauty  = await Beauty.findById(beautyId);
    
      res.json(beauty);
  
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
  
      
      const newBeauty = await Beauty.create({ title, description, image, affiliateLink, category, sub_category });
      console.log("Beauty created successfully");
  
      res.status(201).json({
        success: true,
        message: "Beauty Created Successfully!",
        product: newBeauty,
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

  // Update a beauty by ID
  router.put('/:id', async (req, res, next) => {
    try {
      const beautyId = req.params['id'];
      const { title, description, image, affiliateLink, category, sub_category } = req.body;

      // Find the beauty by ID and update it with the new data
      const updatedBeauty = await Beauty.findByIdAndUpdate(
        beautyId, 
        { title, description, image, affiliateLink, category, sub_category }, 
        { new: true, runValidators: true }
      );

      // If the beautyId is not found, return an error
      if (!updatedBeauty) {
        return next(new ErrorHandler("Beauty not found", 404));
      }

      // Send the updated Beauty Item in the response
      res.status(200).json({
        success: true,
        message: "Beauty updated successfully!",
        Beauty: updatedBeauty,
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

   // Delete a BEAUTY Item by ID
   router.delete('/:id', async (req, res, next) => {
    try {
      const beautyId = req.params['id'];
  
      // Find the beauty by ID and delete it
      const deletedBeauty = await Beauty.findByIdAndDelete(beautyId);
  
      // If the beauty is not found, return an error
      if (!deletedBeauty) {
        return next(new ErrorHandler("Beauty not found", 404));
      }
  
      // Send a success message
      res.status(200).json({
        success: true,
        message: "Beauty deleted successfully!",
        product: deletedBeauty, // Optionally returning the deleted Beauty details
      });
    } catch (error) {
      console.log("An error occurred:", error);
      return next(error);
    }
  });

  module.exports = router;