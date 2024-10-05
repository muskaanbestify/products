// routes/blogs.js
const express = require('express');
const Blog = require('../models/Blog');

const router = express.Router();

// GET all blogs
router.get('/', async (req, res) => {
    try {
      const blogs = await Blog.find();
      res.json(blogs);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

// GET a specific blog by ID
router.get('/:id', async (req, res) => {
    try {
      const blog = await Blog.findById(req.params.id);
      if (!blog) return res.status(404).json({ message: 'Blog not found' });
      res.json(blog);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

// POST a new blog
router.post('/', async (req, res) => {
  const { title, description, imageSrc, imageAlt } = req.body;
  try {
    const newBlog = new Blog({ title, description, imageSrc, imageAlt });
    await newBlog.save();
    res.status(201).json({ message: 'Blog created', blog: newBlog });
  } catch (error) {
    res.status(400).json({ message: 'Error creating blog', error });
  }
});

// PUT to update a blog
router.put('/:id', async (req, res) => {
  const { title, description, imageSrc, imageAlt } = req.body;
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, { title, description, imageSrc, imageAlt }, { new: true });
    if (!updatedBlog) return res.status(404).json({ message: 'Blog not found' });
    res.status(200).json({ message: 'Blog updated', blog: updatedBlog });
  } catch (error) {
    res.status(400).json({ message: 'Error updating blog', error });
  }
});

// DELETE a blog
router.delete('/:id', async (req, res) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
    if (!deletedBlog) return res.status(404).json({ message: 'Blog not found' });
    res.status(200).json({ message: 'Blog deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting blog', error });
  }
});

module.exports = router;
