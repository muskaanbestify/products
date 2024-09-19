const mongoose = require("mongoose")

const BlogSchema = new mongoose.Schema({

    id:{
        type: mongoose.Schema.Types.ObjectId,
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