const mongoose = require("mongoose")

const BlogSchema = new mongoose.Schema({

    id:{
        type: Number,
        required:true,
    },
    title:{
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    }
})

const Blog = mongoose.model("Blog", BlogSchema);
module.exports = Blog;
