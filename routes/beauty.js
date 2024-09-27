const express = require("express");
const router = express.Router();
const BeautyModel = require("../models/Beauty");
const ErrorHandler = require("../middlewares/error");

// Route to fetch beauty products with pagination and filtering by category and subcategory
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
    let beautyProduct = await BeautyModel.find(queryObject)
      .limit(productsLimit * 3)
      .skip((pageNumber - 1) * productsLimit); //finding all the appliances items according to the query
    // console.log(appliances);

    // Check if the appliances collection is empty
    if (!beautyProduct || beautyProduct.length === 0) {
      res.status(200).json({
        success: false,
        message: "No appliances items Not found",
        beautyProduct: [],
      });
    }
    let extraPages = Math.ceil(beautyProduct.length / productsLimit);
    if (beautyProduct.length > productsLimit) {
      beautyProduct = beautyProduct.slice(0, productsLimit); //slicing the beautyProduct items according to the limit
      // Send the beautyProduct items as the response
    }

    // Send the appliances items as the response
    res.status(200).json({
      success: true,
      count: beautyProduct.length,
      beautyProduct: beautyProduct, //sending the retrieved appliances collection in response !
      extraPages: extraPages-1,
    });
  } catch (error) {
    console.log("An error occurred:", error.message);
    // Pass the error to the error-handling middleware
    return next(new ErrorHandler("Failed to retrieve appliances items", 500));
  }
});
// Route to fetch a specific beauty product by ID
router.get("/:id", async (req, res, next) => {
  try {
    const productId = req.params.id;
    console.log("Fetching beauty product with ID:", productId);

    const beautyProduct = await BeautyModel.findById(productId);

    if (!beautyProduct) {
      return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json(beautyProduct);
  } catch (err) {
    console.error("Error fetching beauty product by ID:", err.message);
    res.status(500).json({ message: "Failed to fetch product details" });
  }
});

// Route to create a new beauty product
router.post("/", async (req, res, next) => {
  try {
    console.log("Creating a new beauty product...");
    const { title, description, image, affiliateLink, category, sub_category } =
      req.body;

    // Ensure all required fields are present
    if (
      !title ||
      !description ||
      !image ||
      !affiliateLink ||
      !category ||
      !sub_category
    ) {
      return next(new ErrorHandler("Please provide all required fields", 400));
    }

    // Create the new beauty product in the database
    const createdProduct = await BeautyModel.create({
      title,
      description,
      image,
      affiliateLink,
      category,
      sub_category,
    });
    console.log("New beauty product created successfully:", createdProduct);

    res.status(201).json({
      success: true,
      message: "Product created successfully!",
      product: createdProduct,
    });
  } catch (err) {
    console.error("Error creating product:", err.message);

    // Handle validation errors
    if (err.name === "ValidationError") {
      const validationErrors = Object.values(err.errors).map(
        (error) => error.message
      );
      return next(new ErrorHandler(validationErrors.join(", "), 400));
    }

    return next(new ErrorHandler("Failed to create product", 500));
  }
});

// Route to update an existing beauty product by ID
router.put("/:id", async (req, res, next) => {
  try {
    const productId = req.params.id;
    const updatedData = req.body;

    console.log("Updating beauty product with ID:", productId);

    const updatedProduct = await BeautyModel.findByIdAndUpdate(
      productId,
      updatedData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedProduct) {
      return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully!",
      product: updatedProduct,
    });
  } catch (err) {
    console.error("Error updating product:", err.message);

    if (err.name === "ValidationError") {
      const validationErrors = Object.values(err.errors).map(
        (error) => error.message
      );
      return next(new ErrorHandler(validationErrors.join(", "), 400));
    }

    return next(new ErrorHandler("Failed to update product", 500));
  }
});

// Route to delete a beauty product by ID
router.delete("/:id", async (req, res, next) => {
  try {
    const productId = req.params.id;
    console.log("Deleting beauty product with ID:", productId);

    const deletedProduct = await BeautyModel.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully!",
      product: deletedProduct,
    });
  } catch (err) {
    console.error("Error deleting product:", err.message);
    return next(new ErrorHandler("Failed to delete product", 500));
  }
});

module.exports = router;
