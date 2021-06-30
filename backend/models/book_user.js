const mongoose = require("mongoose");

const bookUserSchema = mongoose.Schema({
    user: {type: String, required: true},
    bookId: {type: String, required: true},
    status: {type: String, required: true},
    readPages: {type: Number},
    numberOfPages: {type: Number},
});



module.exports = mongoose.model("BookUser", bookUserSchema);