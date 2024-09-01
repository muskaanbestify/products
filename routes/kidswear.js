const express = require('express');
const router = express.Router();
const KidsWear = require("../models/KidsWear")
const ErrorHandler = require("../middlewares/error")


// Get all kidswear items
router.get("/", async (req, res, next) => {
  // fetching query with pae number and other query parameters
  const query = req.query;

  console.log("Query:", query);
  // Extract the page number from the query and remove it from the query object
  const { page, limit, ...restQuery } = query;

  // Create a query object with the remaining query parameters

  // restQuery may contain other query parameters like category, sub_category, etc.
  const queryObject = { ...restQuery };

  // If the page number is not provided, set it to 1
  const pageNumber = parseInt(page) || 1;
  const productsimit = parseInt(limit) || 25;
  // console.log("Page Number:", productsimit);
  // console.log("Query:", query);
  try {
    // Fetch all kidswear items from the database with pagination
    let kidswear = await KidsWear.find(queryObject)
      .limit(productsimit)
      .skip((pageNumber - 1) * productsimit); //finding all the kidswear items according to the query
    // console.log(kidswear);

    // Check if the kidswear collection is empty
    if (!kidswear || kidswear.length === 0) {
      return next(new ErrorHandler("No kidswear Item Found", 404));
    }

    // Send the kidswear items as the response
    res.status(200).json({
      success: true,
      count: kidswear.length,
      kidswear: kidswear, //sending the retrieved kidswear collection in response !
    });
  } catch (error) {
    console.log("An error occurred:", error.message);
    // Pass the error to the error-handling middleware
    return next(new ErrorHandler("Failed to retrieve kidswear items", 500));
  }
});


//Get a kidswear Item by Id
router.get('/:id', async(req,res) => {
    try {
      
      const kidswearid = req.params['id']; 
  
      let kidswear  = await KidsWear.findById(kidswearid); //finding on the basis of ID
    
      res.json(kidswear);
  
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
  
      
      const newKidsWear = await KidsWear.create({ title, description, image, affiliateLink, category, sub_category });
      console.log("KidsWear created successfully");
  
      res.status(201).json({
        success: true,
        message: "KidsWear Created Successfully!",
        product: newKidsWear,
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

  // Update a kidswear by ID
  router.put('/:id', async (req, res, next) => {
    try {
      const kidswearId = req.params['id'];
      const { title, description, image, affiliateLink, category, sub_category } = req.body;

      // Find the kidswear by ID and update it with the new data
      const updatedKidsWear = await KidsWear.findByIdAndUpdate(
        kidswearId, 
        { title, description, image, affiliateLink, category, sub_category }, 
        { new: true, runValidators: true }
      );

      // If the kidswear is not found, return an error
      if (!updatedKidsWear) {
        return next(new ErrorHandler("KidsWear not found", 404));
      }

      // Send the updated product in the response
      res.status(200).json({
        success: true,
        message: "KidsWear updated successfully!",
        kidswear: updatedKidsWear,
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
      const kidswearId = req.params['id'];
  
      // Find the kidswear by ID and delete it
      const deletedKidsWear = await KidsWear.findByIdAndDelete(kidswearId);
  
      // If the KidsWear is not found, return an error
      if (!deletedKidsWear) {
        return next(new ErrorHandler("KidsWear not found", 404));
      }
  
      // Send a success message
      res.status(200).json({
        success: true,
        message: "KidsWear deleted successfully!",
        product: deletedKidsWear, // Optionally returning the deleted KidsWear details
      });
    } catch (error) {
      console.log("An error occurred:", error);
      return next(error);
    }
  });

  module.exports = router;