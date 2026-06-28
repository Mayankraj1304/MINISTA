const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    caption: {
        type: String,
        required: [ true, "Caption is required" ]
    },
    imgUrl: {
        type: String,
        required: [ true, "Image URL is required" ]
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: [ true, "User is required" ]
    }
}, { timestamps: true })


const postModel = mongoose.model("posts", postSchema)

module.exports = postModel
