const express = require('express');
const router = express.Router();
const WomensWear = require("../models/WomensWear")
const ErrorHandler = require("../middlewares/error")
const url = require("url");


// Function to parse the query parameters from the URL
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
  const productsLimit = parseInt(limit) || 21;
  // console.log("Page Number:", productsLimit);
  // console.log("Query:", query);
  try {
    // Fetch all appliances items from the database with pagination
    let womenswear = await WomensWear.find(queryObject)
      .limit(productsLimit)
      .skip((pageNumber - 1) * productsLimit); //finding all the appliances items according to the query
    // console.log(appliances);

    // Check if the appliances collection is empty
    if (!womenswear || womenswear.length === 0) {
      res.status(200).json({
        success: false,
        message: "No appliances items Not found",
        womenswear: [],
      });
    }


    
    let extraPages = Math.ceil(womenswear.length / productsLimit);
    if (womenswear.length > productsLimit) {
      womenswear = womenswear.slice(0, productsLimit); //slicing the womenswear items according to the limit
      // Send the womenswear items as the response
    }


    // Send the appliances items as the response
    res.status(200).json({
      success: true,
      count: womenswear.length,
      womenswear: womenswear, //sending the retrieved appliances collection in response !
      extraPages: extraPages-1,
    });
  } catch (error) {
    console.log("An error occurred:", error.message);
    // Pass the error to the error-handling middleware
    return next(new ErrorHandler("Failed to retrieve appliances items", 500));
  }
});

//example : http://localhost:8080/api/womenswear?pageNo=1&limit=25&category=Sports%20&%20Active%20Wear&sub_category=Clothing
// Get all womenswear items
router.get('/', async (req, res, next) => {
    // taking request query storing that in query
    // const query = req.query;
    const query = url.parse(req.url).query; 
    console.log(query);

    // extracting the actual query parameters, using above function to decode the url
    const parsedQuery = query ? parseQueryParams(query) : {};     

    const { pageNo,limit, ...restAll } = parsedQuery; 
    console.log('qUERY:',parsedQuery);
    
    // enocde the query, converting & to %26
    //checking the url , to know 
    // const jsonString = JSON.stringify(query);
    // const encodequery = encodeURIComponent(jsonString)
    // console.log(encodequery)
    // const decodequery = decodeURIComponent(encodequery)
    // console.log(decodequery)

    // const convt = new URLSearchParams(restAll).toString(); 
    // console.log(convt)

    // Clean up and normalize query parameters
    // const cleanedQuery = Object.entries(restAll).reduce((acc, [key, value]) => {
    //   // Trim spaces from both key and value
    //   const cleanedKey = key.trim().replace('&','%26');
    //   const cleanedValue = value.replace('&','%26');

    //   // Only add non-empty values
    //   if (cleanedValue) {
    //       acc[cleanedKey] = cleanedValue;
    //   }
    //   return acc;
    // }, {});
    // console.log("Cleaned Query:", cleanedQuery);


    // Create a query object with the remaining query parameters
    // restAll contain other query parameters like category, sub_category, etc.
    const queryinfo = { ...restAll };
    // If the page number is not provided, set it to 1
    const pageNumber = parseInt(pageNo) || 1;
    // console.log("Query:", query);
    try {
      // Fetch all womenswear items from the database
      console.log("all fine")
      let womenswear = await WomensWear.find(queryinfo)
        .limit(25)
        .skip((pageNumber - 1) * 25);
      console.log(queryinfo);

      //console.log(womenswear);
     
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
    } 
    catch (error) {
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