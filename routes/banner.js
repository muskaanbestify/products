const express = require("express");
const router = express.Router();
const ErrorHandler = require("../middlewares/error");
const MensWear = require("../models/MensWear");
const KidsWear = require("../models/KidsWear");
const WomensWear = require("../models/WomensWear");
const Appliances = require("../models/Appliances");
const BeautyModel = require("../models/Beauty");
const PhoneAccessories = require("../models/PhoneAccessories");

// Get all menswear items
// Get all products items
router.get("/latest", async (req, res, next) => {
  // fetching query with pae number and other query parameters
  const query = req.query;

  console.log("Query:", query);
  // Extract the page number from the query and remove it from the query object
  const { page, limit, mainCategory, banner, ...restQuery } = query;

  // Create a query object with the remaining query parameters

  // restQuery may contain other query parameters like category, sub_category, etc.
  const queryObject = { ...restQuery };

  // If the page number is not provided, set it to 1
  const pageNumber = parseInt(page) || 1;
  const productsLimit = parseInt(limit) || 5;
  // console.log("Page Number:", productsLimit);
  // console.log("Query:", query);

  try {
    let products;

    // Fetch all products items from the database with pagination
    if (mainCategory === "kidswear") {
      products = await KidsWear.find(queryObject)
        .sort({ _id: -1 })
        .limit(productsLimit * 3)
        .skip((pageNumber - 1) * productsLimit); //finding all the products items according to the query
      // console.log(products);
    } else if (mainCategory === "menswear") {
      products = await MensWear.find(queryObject)
        .sort({ _id: -1 })
        .limit(productsLimit * 3)
        .skip((pageNumber - 1) * productsLimit); //finding all the products items according to the query
      // console.log(products
    } else if (mainCategory === "womenswear") {
      products = await WomensWear.find(queryObject)
        .sort({ _id: -1 })
        .limit(productsLimit * 3)
        .skip((pageNumber - 1) * productsLimit); //finding all the products items according to the query
      // console.log(products
    } else if (mainCategory === "appliances") {
      products = await Appliances.find(queryObject)
        .sort({ _id: -1 })
        .limit(productsLimit * 3)
        .skip((pageNumber - 1) * productsLimit); //finding all the products items according to the query
      // console.log(products
    } else if (mainCategory === "beauty") {
      products = await BeautyModel.find(queryObject)
        .sort({ _id: -1 })
        .limit(productsLimit * 3)
        .skip((pageNumber - 1) * productsLimit); //finding all the products items according to the query
      // console.log(products
    } else if (mainCategory === "phoneaccessories") {
      products = await PhoneAccessories.find(queryObject)
        .sort({ _id: -1 })
        .limit(productsLimit * 3)
        .skip((pageNumber - 1) * productsLimit); //finding all the products items according to the query
      // console.log(products
    } else {
      let menswear = await MensWear.find(queryObject)
        .sort({ _id: -1 })
        .limit(productsLimit)
        .skip((pageNumber - 1) * productsLimit); //finding all the products items according to the query
      // console.log(products);
      let kidswear = await KidsWear.find(queryObject)
        .sort({ _id: -1 })
        .limit(productsLimit)
        .skip((pageNumber - 1) * productsLimit); //finding all the products items according to the query
      // console.log(products);
      let womenswear = await WomensWear.find(queryObject)
        .sort({ _id: -1 })
        .limit(productsLimit)
        .skip((pageNumber - 1) * productsLimit); //finding all the products items according to the query
      // console.log(products);
      let appliances = await Appliances.find(queryObject)
        .sort({ _id: -1 })
        .limit(productsLimit)
        .skip((pageNumber - 1) * productsLimit); //finding all the products items according to the query
      // console.log(products);
      let beauty = await BeautyModel.find(queryObject)
        .sort({ _id: -1 })
        .limit(productsLimit)
        .skip((pageNumber - 1) * productsLimit); //finding all the products items according to the query
      // console.log(products);
      let phoneaccessories = await PhoneAccessories.find(queryObject)
        .sort({ _id: -1 })
        .limit(productsLimit)
        .skip((pageNumber - 1) * productsLimit); //finding all the products items according to the query
      // console.log(products);

      products = menswear.concat(
        kidswear,
        womenswear,
        appliances,
        beauty,
        phoneaccessories
      );
    }

    // Check if the products collection is empty
    if (!products || products.length === 0) {
      res.status(404).json({
        success: false,
        message: "No products items found",
      });
    }

    let extraPages = Math.ceil(products.length / productsLimit);

    // Send the products items as the response
    res.status(200).json({
      success: true,
      count: products.length,
      products: products, //sending the retrieved products collection in response !
      extraPages: extraPages - 1,
    });
  } catch (error) {
    console.log("An error occurred:", error.message);
    // Pass the error to the error-handling middleware
    return next(new ErrorHandler("Failed to retrieve products items", 500));
  }
});

router.get("/bestselling-gadgets", async (req, res, next) => {
  try {
    // const products = await PhoneAccessories.find().sort({ _id: -1 }).limit(30);

    let queryObject = { category: "Electronics" };

    let productsLimit = 30;
    let products;
    let menswear = await MensWear.find(queryObject)
      .sort({ _id: -1 })
      .limit(productsLimit);
    let kidswear = await KidsWear.find(queryObject)
      .sort({ _id: -1 })
      .limit(productsLimit);
    let womenswear = await WomensWear.find(queryObject)
      .sort({ _id: -1 })
      .limit(productsLimit);
    let appliances = await Appliances.find(queryObject)
      .sort({ _id: -1 })
      .limit(productsLimit);
    let beauty = await BeautyModel.find(queryObject)
      .sort({ _id: -1 })
      .limit(productsLimit);
    let phoneaccessories = await PhoneAccessories.find(queryObject)
      .sort({ _id: -1 })
      .limit(productsLimit);

    products = menswear.concat(
      kidswear,
      womenswear,
      appliances,
      beauty,
      phoneaccessories
    );

    // sort products by descending order of their _id
    products.sort((item1, item2) => item2._id - item1._id);

    // have to send first 30 products
    products = products.slice(0, 30);

    if (!products || products.length === 0) {
      res.status(404).json({
        success: false,
        message: "No products items found",
      });
    }

    res.status(200).json({
      success: true,
      count: products.length,
      products: products, //sending the retrieved products collection in response !
    });
  } catch (error) {
    console.log("An error occurred:", error.message);
    // Pass the error to the error-handling middleware
    return next(new ErrorHandler("Failed to retrieve products items", 500));
  }
});
router.get("/handpicked", async (req, res, next) => {
  try {
    // const products = await PhoneAccessories.find().sort({ _id: -1 }).limit(30);

    let queryObject = {};

    let productsLimit = 10;
    let products;
    let menswear = await MensWear.find(queryObject)
      .sort({ _id: -1 })
      .limit(productsLimit);
    let kidswear = await KidsWear.find(queryObject)
      .sort({ _id: -1 })
      .limit(productsLimit);
    let womenswear = await WomensWear.find(queryObject)
      .sort({ _id: -1 })
      .limit(productsLimit);
    let appliances = await Appliances.find(queryObject)
      .sort({ _id: -1 })
      .limit(productsLimit);
    let beauty = await BeautyModel.find(queryObject)
      .sort({ _id: -1 })
      .limit(productsLimit);
    let phoneaccessories = await PhoneAccessories.find(queryObject)
      .sort({ _id: -1 })
      .limit(productsLimit);

    products = menswear.concat(
      kidswear,
      womenswear,
      appliances,
      beauty,
      phoneaccessories
    );

    // sort products by descending order of their _id
    products.sort((item1, item2) => item2._id - item1._id);

    // have to send first 30 products
    if (products.length > 30) {
      products = products.slice(0, 30);
    }

    products = products.sort(() => Math.random() - 0.5);

    if (!products || products.length === 0) {
      res.status(404).json({
        success: false,
        message: "No products items found",
      });
    }

    res.status(200).json({
      success: true,
      count: products.length,
      products: products, //sending the retrieved products collection in response !
    });
  } catch (error) {
    console.log("An error occurred:", error.message);
    // Pass the error to the error-handling middleware
    return next(new ErrorHandler("Failed to retrieve products items", 500));
  }
});

module.exports = router;
