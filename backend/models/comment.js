const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
    user: {type: String, required: true},
    bookId: {type: String, required: true},
    review: {type: Number, required: true},
    content: {type: String},
});



module.exports = mongoose.model("Comment", commentSchema);