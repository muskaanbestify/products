const express = require("express");
const router = express.Router();
const PhoneAccessories = require("../models/PhoneAccessories");
const ErrorHandler = require("../middlewares/error");

// Get all Phone Accessories items
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
    let accessories = await PhoneAccessories.find(queryObject)
      .limit(productsLimit*3)
      .skip((pageNumber - 1) * productsLimit); //finding all the appliances items according to the query
    // console.log(appliances);

    // Check if the appliances collection is empty
    if (!accessories || accessories.length === 0) {
      res.status(200).json({
        success: false,
        message: "No appliances items Not found",
        accessories: [],
      });
    }

    let extraPages = Math.ceil(accessories.length / productsLimit);
    if (accessories.length > productsLimit) {
      accessories = accessories.slice(0, productsLimit); //slicing the accessories items according to the limit
      // Send the accessories items as the response
    }

    // Send the appliances items as the response
    res.status(200).json({
      success: true,
      count: accessories.length,
      accessories: accessories, //sending the retrieved appliances collection in response !
      extraPages: extraPages-1,
    });
  } catch (error) {
    console.log("An error occurred:", error.message);
    // Pass the error to the error-handling middleware
    return next(new ErrorHandler("Failed to retrieve appliances items", 500));
  }
});
//Get a beauty by product id
router.get("/:id", async (req, res) => {
  try {
    const phoneAccessoriesId = req.params["id"];

    let phoneAccessory = await PhoneAccessories.findById(phoneAccessoriesId);

    res.json(phoneAccessory);
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

    const newPhoneAccessory = await PhoneAccessories.create({
      title,
      description,
      image,
      affiliateLink,
      category,
      sub_category,
    });
    console.log("Phone Accessory created successfully");

    res.status(201).json({
      success: true,
      message: "Phone Accessory Created Successfully!",
      product: newPhoneAccessory,
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

// Update a PhoneAccessory by ID
router.put("/:id", async (req, res, next) => {
  try {
    const phoneAccessoryId = req.params["id"];
    const { title, description, image, affiliateLink, category, sub_category } =
      req.body;

    // Find the PhoneAccessory by ID and update it with the new data
    const updatedPhoneAccessory = await PhoneAccessories.findByIdAndUpdate(
      phoneAccessoryId,
      { title, description, image, affiliateLink, category, sub_category },
      { new: true, runValidators: true }
    );

    // If the phoneAccessoryId is not found, return an error
    if (!phoneAccessoryId) {
      return next(new ErrorHandler("Phone Accessory not found", 404));
    }

    // Send the updated Beauty in the response
    res.status(200).json({
      success: true,
      message: "Phone Accessory updated successfully!",
      PhoneAccessories: updatedPhoneAccessory,
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

// Delete a Phone Accessory by ID
router.delete("/:id", async (req, res, next) => {
  try {
    const phoneAccessoryId = req.params["id"];

    // Find the PhoneAccessory by ID and delete it
    const deletedPhoneAccessory = await PhoneAccessories.findByIdAndDelete(
      phoneAccessoryId
    );

    // If the PhoneAccessory is not found, return an error
    if (!deletedPhoneAccessory) {
      return next(new ErrorHandler("Phone Accessory not found", 404));
    }

    // Send a success message
    res.status(200).json({
      success: true,
      message: "Phone Accessory deleted successfully!",
      product: deletedPhoneAccessory, // Optionally returning the deleted Beauty details
    });
  } catch (error) {
    console.log("An error occurred:", error);
    return next(error);
  }
});

module.exports = router;
