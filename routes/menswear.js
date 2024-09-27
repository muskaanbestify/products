const express = require("express");
const router = express.Router();
const MensWear = require("../models/MensWear");
const ErrorHandler = require("../middlewares/error");

// Get all menswear items
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
    let menswear = await MensWear.find(queryObject)
      .limit(productsLimit*3)
      .skip((pageNumber - 1) * productsLimit); //finding all the appliances items according to the query
    // console.log(appliances);

    // Check if the appliances collection is empty
    if (!menswear || menswear.length === 0) {
      res.status(200).json({
        success: false,
        message: "No appliances items Not found",
        menswear: [],
      });
    }

    let extraPages = Math.ceil(menswear.length / productsLimit);
    if (menswear.length > productsLimit) {
      menswear = menswear.slice(0, productsLimit); //slicing the menswear items according to the limit
      // Send the menswear items as the response
    }

    // Send the appliances items as the response
    res.status(200).json({
      success: true,
      count: menswear.length,
      menswear: menswear, //sending the retrieved appliances collection in response !
      extraPages: extraPages-1,
    });
  } catch (error) {
    console.log("An error occurred:", error.message);
    // Pass the error to the error-handling middleware
    return next(new ErrorHandler("Failed to retrieve appliances items", 500));
  }
});
//Get a menswear by id
router.get("/:id", async (req, res) => {
  try {
    const menswearId = req.params["id"];

    let menswear = await MensWear.findById(menswearId);

    res.json(menswear);
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

    const newMensWear = await MensWear.create({
      title,
      description,
      image,
      affiliateLink,
      category,
      sub_category,
    });
    console.log("MensWear created successfully");

    res.status(201).json({
      success: true,
      message: "MensWear Created Successfully!",
      product: newMensWear,
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

// Update a menswear by ID
router.put("/:id", async (req, res, next) => {
  try {
    const menswearId = req.params["id"];
    const { title, description, image, affiliateLink, category, sub_category } =
      req.body;

    // Find the menswear by ID and update it with the new data
    const updatedMensWear = await MensWear.findByIdAndUpdate(
      menswearId,
      { title, description, image, affiliateLink, category, sub_category },
      { new: true, runValidators: true }
    );

    // If the Men's Wear is not found, return an error
    if (!updatedMensWear) {
      return next(new ErrorHandler("Men's Wear not found", 404));
    }

    // Send the updated MensWear in the response
    res.status(200).json({
      success: true,
      message: "MensWear updated successfully!",
      MensWear: updatedMensWear,
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
    const menswearId = req.params["id"];

    // Find the menswear by ID and delete it
    const deletedMensWear = await MensWear.findByIdAndDelete(menswearId);

    // If the menswear is not found, return an error
    if (!deletedMensWear) {
      return next(new ErrorHandler("Men's Wear not found", 404));
    }

    // Send a success message
    res.status(200).json({
      success: true,
      message: "MensWear deleted successfully!",
      product: deletedMensWear, // Optionally returning the deleted menswear details
    });
  } catch (error) {
    console.log("An error occurred:", error);
    return next(error);
  }
});

module.exports = router;
