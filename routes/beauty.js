const express = require('express');
const router = express.Router();
const BeautyModel = require('../models/Beauty');
const ErrorHandler = require('../middlewares/error');

// Route to fetch beauty products with pagination and filtering by category and subcategory
router.get('/', async (req, res, next) => {
    try {
        // Extract query parameters from the request
        const { page = 1, limit = 25, category, sub_category } = req.query;

        console.log(`Fetching beauty products - Page: ${page}, Limit: ${limit}, Category: ${category}, Subcategory: ${sub_category}`);

        // Build the query object for filtering by category and subcategory
        let query = {};
        if (category) query.category = category;
        if (sub_category) query.sub_category = sub_category;

        // Fetch paginated beauty products based on the query and pagination options
        const beautyItems = await BeautyModel.find(query)
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));

        // Count the total number of products that match the query (without pagination)
        const totalItems = await BeautyModel.countDocuments(query);

        console.log('Fetched beauty items:', beautyItems);

        // If no beauty products are found, throw an error
        if (!beautyItems || beautyItems.length === 0) {
            return next(new ErrorHandler('No beauty products available', 404));
        }

        // Send the list of beauty products in the response with pagination info
        res.status(200).json({
            success: true,
            totalItems,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalItems / limit),
            itemCount: beautyItems.length,
            products: beautyItems,
        });
    } catch (err) {
        console.error('Error fetching beauty products:', err.message);
        return next(new ErrorHandler('Could not retrieve beauty products', 500));
    }
});

// Route to fetch a specific beauty product by ID
router.get('/:id', async (req, res, next) => {
    try {
        const productId = req.params.id;
        console.log('Fetching beauty product with ID:', productId);

        const beautyProduct = await BeautyModel.findById(productId);

        if (!beautyProduct) {
            return next(new ErrorHandler('Product not found', 404));
        }

        res.status(200).json(beautyProduct);
    } catch (err) {
        console.error('Error fetching beauty product by ID:', err.message);
        res.status(500).json({ message: 'Failed to fetch product details' });
    }
});

// Route to create a new beauty product
router.post('/', async (req, res, next) => {
    try {
        console.log('Creating a new beauty product...');
        const { title, description, image, affiliateLink, category, sub_category } = req.body;

        // Ensure all required fields are present
        if (!title || !description || !image || !affiliateLink || !category || !sub_category) {
            return next(new ErrorHandler('Please provide all required fields', 400));
        }

        // Create the new beauty product in the database
        const createdProduct = await BeautyModel.create({ title, description, image, affiliateLink, category, sub_category });
        console.log('New beauty product created successfully:', createdProduct);

        res.status(201).json({
            success: true,
            message: 'Product created successfully!',
            product: createdProduct,
        });
    } catch (err) {
        console.error('Error creating product:', err.message);

        // Handle validation errors
        if (err.name === 'ValidationError') {
            const validationErrors = Object.values(err.errors).map((error) => error.message);
            return next(new ErrorHandler(validationErrors.join(', '), 400));
        }

        return next(new ErrorHandler('Failed to create product', 500));
    }
});

// Route to update an existing beauty product by ID
router.put('/:id', async (req, res, next) => {
    try {
        const productId = req.params.id;
        const updatedData = req.body;

        console.log('Updating beauty product with ID:', productId);

        const updatedProduct = await BeautyModel.findByIdAndUpdate(productId, updatedData, {
            new: true,
            runValidators: true,
        });

        if (!updatedProduct) {
            return next(new ErrorHandler('Product not found', 404));
        }

        res.status(200).json({
            success: true,
            message: 'Product updated successfully!',
            product: updatedProduct,
        });
    } catch (err) {
        console.error('Error updating product:', err.message);

        if (err.name === 'ValidationError') {
            const validationErrors = Object.values(err.errors).map((error) => error.message);
            return next(new ErrorHandler(validationErrors.join(', '), 400));
        }

        return next(new ErrorHandler('Failed to update product', 500));
    }
});

// Route to delete a beauty product by ID
router.delete('/:id', async (req, res, next) => {
    try {
        const productId = req.params.id;
        console.log('Deleting beauty product with ID:', productId);

        const deletedProduct = await BeautyModel.findByIdAndDelete(productId);

        if (!deletedProduct) {
            return next(new ErrorHandler('Product not found', 404));
        }

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully!',
            product: deletedProduct,
        });
    } catch (err) {
        console.error('Error deleting product:', err.message);
        return next(new ErrorHandler('Failed to delete product', 500));
    }
});

module.exports = router;
