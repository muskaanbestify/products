const express = require("express");
const router = express.Router();
const Appliances = require("../models/Appliances");
const ErrorHandler = require("../middlewares/error");

//get all Appliance items
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
    // Fetch all appliances items from the database with pagination
    let appliance = await Appliances.find(queryObject)
      .limit(productsLimit*3)
      .skip((pageNumber - 1) * productsLimit); //finding all the appliances items according to the query
    // console.log(appliances);

    // Check if the appliances collection is empty
    if (!appliance || appliance.length === 0) {
      res.status(200).json({
        success: false,
        message: "No appliances items Not found",
        appliance: [],
      });
    }
    let extraPages = Math.ceil(appliance.length / productsLimit);
    if (appliance.length > productsLimit) {
      appliance = appliance.slice(0, productsLimit); //slicing the appliance items according to the limit
      // Send the appliance items as the response
    }


    // Send the appliances items as the response
    res.status(200).json({
      success: true,
      count: appliance.length,
      appliance: appliance, //sending the retrieved appliances collection in response !
      extraPages: extraPages-1,
    });
  } catch (error) {
    console.log("An error occurred:", error.message);
    // Pass the error to the error-handling middleware
    return next(new ErrorHandler("Failed to retrieve appliances items", 500));
  }
});
// Get all appliances items
router.get("/", async (req, res, next) => {
  try {
    // Fetch all appliances items from the database
    console.log("all fine");
    let appliances = await Appliances.find();
    console.log(appliances);

    // Check if the appliances collection is empty
    if (!appliances || appliances.length === 0) {
      return next(new ErrorHandler("No Appliances items found", 404));
    }

    // Send the appliances items as the response
    res.status(200).json({
      success: true,
      count: appliances.length,
      Appliance: appliances, //sending the retrieved appliances collection in response !
    });
  } catch (error) {
    console.log("An error occurred:", error.message);
    // Pass the error to the error-handling middleware
    return next(new ErrorHandler("Failed to retrieve appliances items", 500));
  }
});

//Get an appliances by product id

router.get("/:id", async (req, res) => {
  try {
    const appliancesId = req.params["id"];

    let appliance = await Appliances.findById(appliancesId);

    res.json(appliance);
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

    const newAppliance = await Appliances.create({
      title,
      description,
      image,
      affiliateLink,
      category,
      sub_category,
    });
    console.log("Appliance created successfully");

    res.status(201).json({
      success: true,
      message: "Appliance Created Successfully!",
      product: newAppliance,
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

// Update an appliance by ID
router.put("/:id", async (req, res, next) => {
  try {
    const applianceId = req.params["id"];
    const { title, description, image, affiliateLink, category, sub_category } =
      req.body;

    // Find the appliance by ID and update it with the new data
    const updatedAppliance = await Appliances.findByIdAndUpdate(
      applianceId,
      { title, description, image, affiliateLink, category, sub_category },
      { new: true, runValidators: true }
    );

    // If the appliance is not found, return an error
    if (!updatedAppliance) {
      return next(new ErrorHandler("Appliance not found", 404));
    }

    // Send the updated Appliance in the response
    res.status(200).json({
      success: true,
      message: "Appliance updated successfully!",
      Appliances: updatedAppliance,
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
    const applianceId = req.params["id"];

    // Find the appliance by ID and delete it
    const deletedAppliance = await Appliances.findByIdAndDelete(applianceId);

    // If the Appliance is not found, return an error
    if (!deletedAppliance) {
      return next(new ErrorHandler("Appliance not found", 404));
    }

    // Send a success message
    res.status(200).json({
      success: true,
      message: "Appliance deleted successfully!",
      product: deletedAppliance, // Optionally returning the deleted appliance details
    });
  } catch (error) {
    console.log("An error occurred:", error);
    return next(error);
  }
});

module.exports = router;
