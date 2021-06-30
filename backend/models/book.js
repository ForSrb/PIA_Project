const mongoose = require("mongoose");

const bookSchema = mongoose.Schema({
    imagePath: {type: String, required: true},
    name: {type: String, required: true},
    authors: {type: String, required: true},
    publishDate: {type: Date, required: true},
    genres: {type: String, required: true},
    description: {type: String, required: true},
    averageReview: {type: Number, required: true}
});



module.exports = mongoose.model("Book", bookSchema);