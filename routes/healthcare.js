const express = require("express");
const router = express.Router();
const Healthcare = require("../models/Healthcare");
const ErrorHandler = require("../middlewares/error");

//get all Healthcare items
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
  // console.log("Page Number:", productsimit);
  // console.log("Query:", query);

  try {
    // Fetch all healthcare items from the database with pagination
    let healthcareProducts = await Healthcare.find(queryObject)
      .limit(productsLimit * 3)
      .skip((pageNumber - 1) * productsLimit); //finding all the healthcare items according to the query
    // console.log(healthcare);

    // Check if the healthcare collection is empty
    if (!healthcareProducts || healthcareProducts.length === 0) {
      res.status(200).json({
        success: false,
        message: "No healthcare items Not found",
        healthcareProducts: [],
      });
    }
    let extraPages = Math.ceil(healthcareProducts.length / productsLimit);
    if (healthcareProducts.length > productsLimit) {
      healthcareProducts = healthcareProducts.slice(0, productsLimit); //slicing the healthcareProducts items according to the limit
      // Send the healthcareProducts items as the response
    }

    // Send the healthcare items as the response
    res.status(200).json({
      success: true,
      count: healthcareProducts.length,
      healthcare: healthcareProducts, //sending the retrieved healthcare collection in response !
      extraPages: extraPages - 1,
    });
  } catch (error) {
    console.log("An error occurred:", error.message);
    // Pass the error to the error-handling middleware
    return next(new ErrorHandler("Failed to retrieve healthcare items", 500));
  }
});
// Get all healthcare items
router.get("/", async (req, res, next) => {
  try {
    // Fetch all healthcare items from the database
    console.log("all fine");
    let healthcare = await Healthcare.find();
    console.log(healthcare);

    // Check if the healthcare collection is empty
    if (!healthcare || healthcare.length === 0) {
      return next(new ErrorHandler("No Healthcare items found", 404));
    }

    // Send the healthcare items as the response
    res.status(200).json({
      success: true,
      count: healthcare.length,
      healthcare: healthcare, //sending the retrieved healthcare collection in response !
    });
  } catch (error) {
    console.log("An error occurred:", error.message);
    // Pass the error to the error-handling middleware
    return next(new ErrorHandler("Failed to retrieve healthcare items", 500));
  }
});

//Get an healthcare by product id

router.get("/:id", async (req, res) => {
  try {
    const healthcareId = req.params["id"];

    let healthcareProducts = await Healthcare.findById(healthcareId);

    res.json(healthcareProducts);
  } catch (err) {
    console.log("Error:", err);
    res.status(500).json({ message: err.message });
  }
});

//Post Route
router.post("/", async (req, res, next) => {
  try {
    console.log("Request received");

    const { title, description, image, affiliateLink, category, sub_category } =
      req.body;
    console.log("Body parsed");

    if (
      !title ||
      !description ||
      !image ||
      !affiliateLink ||
      !category ||
      !sub_category
    ) {
      return next(new ErrorHandler("Error! Please Fill out the Details", 400));
    }

    console.log("All fields are present");

    const newHealthcare = await Healthcare.create({
      title,
      description,
      image,
      affiliateLink,
      category,
      sub_category,
    });
    console.log("Healthcare created successfully");

    res.status(201).json({
      success: true,
      message: "Healthcare Created Successfully!",
      product: newHealthcare,
    });
    console.log("Response sent");
  } catch (error) {
    console.log("An error occurred:", error);

    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      return next(new ErrorHandler(validationErrors.join(", "), 400));
    }

    // Handle other errors
    return next(error);
  }
});

// Update an healthcareProducts by ID
router.put("/:id", async (req, res, next) => {
  try {
    const healthcareProductsId = req.params["id"];
    const { title, description, image, affiliateLink, category, sub_category } =
      req.body;

    // Find the healthcareProducts by ID and update it with the new data
    const updatedHealthcare = await Healthcare.findByIdAndUpdate(
      healthcareProductsId,
      { title, description, image, affiliateLink, category, sub_category },
      { new: true, runValidators: true }
    );

    // If the healthcareProducts is not found, return an error
    if (!updatedHealthcare) {
      return next(new ErrorHandler("Healthcare not found", 404));
    }

    // Send the updated Healthcare in the response
    res.status(200).json({
      success: true,
      message: "Healthcare updated successfully!",
      healthcare: updatedHealthcare,
    });
  } catch (error) {
    console.log("An error occurred:", error);

    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      return next(new ErrorHandler(validationErrors.join(", "), 400));
    }

    // Handle other errors
    return next(error);
  }
});

// Delete a product by ID
router.delete("/:id", async (req, res, next) => {
  try {
    const healthcareProductsId = req.params["id"];

    // Find the healthcareProducts by ID and delete it
    const deletedHealthcare = await Healthcare.findByIdAndDelete(
      healthcareProductsId
    );

    // If the Healthcare is not found, return an error
    if (!deletedHealthcare) {
      return next(new ErrorHandler("Healthcare not found", 404));
    }

    // Send a success message
    res.status(200).json({
      success: true,
      message: "Healthcare deleted successfully!",
      product: deletedHealthcare, // Optionally returning the deleted healthcareProducts details
    });
  } catch (error) {
    console.log("An error occurred:", error);
    return next(error);
  }
});

module.exports = router;
