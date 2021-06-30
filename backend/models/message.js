const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
    eventId: {type: String, required: true},
    user: {type: String, required: true},
    message: {type: String, required: true},
});



module.exports = mongoose.model("Message", messageSchema);