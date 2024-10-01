const express = require('express');
const router = express.Router();
const Blog = require("../models/Blog");
const ErrorHandler = require("../middlewares/error");

router.get('/', async(req, res, next) => {
    try {
        let blog = await Blog.find()
        console.log(blog)

        //check if there are blogs in back-end
        if (!blog || blog.length === 0){
            return next(new ErrorHandler("No blog found:", 404))
        }
        //Send blog entries as the response
        res.status(200).json({
            success:true,
            count:blog.length,
            blog: blog
        })
    } catch(error) {
        console.log('An error found:', error.message)
        return next(new ErrorHandler("Failed to retrieve blogs", 500))
    }
})

// GET /api/title - Get all blog titles
router.get('/title', async (req, res) => {
  try {
      const titles = await Blog.find({}, 'title'); // Fetch all titles

      //handle error case
      if (!titles){
        return res.status(404).json({ message: 'titles not found' }); 
      }
      res.json(titles);
  } catch (err) {
      console.error('Error:', err);
      res.status(500).json({ message: err.message });
  }
});

//Get a specific blog item by title

router.get('/title/:title', async(req, res) => {

  try{
    console.log("request params:", req.params);
    const title = req.params.title
    let blog = await Blog.findOne({title})
    
    // Handle not found case
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' }); 
  }
    res.json(blog)
  }
  catch(error){
    console.error('Error: ', error)
    res.status(500).json({message: error.message})
  }
})

//get a blog item by id
router.get('/:id', async(req, res) => {
    try{
        const blogid = req.params['id']
        let blog = await Blog.findById(blogid)

        res.json(blog)

    } catch (err) {
        console.log("Error:",err);
        res.status(500).json({ message: err.message });
      }
  
})

router.get('/',async (req,res) => {
  try{
      // const displayName = req
      console.log(req.query);
      // we need to query
       const mongodata = await Blog.find(req.query)
      res.status(200).json(mongodata);
  }catch(err){
      console.log(err)
      res.sendStatus(404);
  }
});

//adding new blog entries
router.post('/', async(req, res, next) => {

    try{
        console.log('Request received')
        const {id, title, description, image} = req.body;
        console.log("Body parsed")

        if(!id || !title || !description || !image) {
            return next(new ErrorHandler("Error! Please Fill out the Details", 400));
          }

  
        const newBlog = await Blog. create({id, title, description, image});
        console.log("Blog created successfully")

        res.status(201).json({
            success: true,
            message: "Blog Created Successfully!",
            blog: newBlog,
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
    
})

//Adding blog by ID
router.put('/:id', async (req, res, next) => {
    try {
      const blogId = req.params['id'];
      const { id, title, description, image } = req.body;

      // Find the blog entry by ID and update it with the new data
      const updatedBlog = await Blog.findByIdAndUpdate(
        blogId, 
        { id, title, description, image }, 
        { new: true, runValidators: true }
      );

      // If the blog is not found, return an error
      if (!updatedBlog) {
        return next(new ErrorHandler("Blog not found", 404));
      }

      // Send the updated blog entry in the response
      res.status(200).json({
        success: true,
        message: "Blog updated successfully!",
        blog: updatedBlog,
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

   // Delete a blog entry by ID
router.delete('/:id', async (req, res, next) => {
    try {
      const blogId = req.params['id'];
  
      // Find the blog entry by ID and delete it
      const deletedBlog = await Blog.findByIdAndDelete(blogId);
  
      // If the blog is not found, return an error
      if (!deletedBlog) {
        return next(new ErrorHandler("blog Id not not found", 404));
      }
  
      // Send a success message
      res.status(200).json({
        success: true,
        message: "Blog deleted successfully!",
        blog: deletedBlog, // Optionally returning the deleted blog details
      });
    } catch (error) {
      console.log("An error occurred:", error);
      return next(error);
    }
  });



module.exports = router;
