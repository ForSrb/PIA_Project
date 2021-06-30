const mongoose = require("mongoose");

const eventSchema = mongoose.Schema({
    creator: {type: String, required: true},
    name: {type: String, required: true},
    beginDate: {type: Date, required: true},
    endDate: {type: Date},
    description: {type: String, required: true},
    isPrivate: {type: Boolean, required: true},
    isActive: {type: Boolean, required: true},
    participants: {type: String}
});



module.exports = mongoose.model("Event", eventSchema);