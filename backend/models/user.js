const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
    name: {type: String, required: true},
    surrname: {type: String, required: true},
    imagePath: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    dateOfBirth: {type: Date, required: true},
    city: {type: String, required: true},
    country: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    type: {type: String, required: true}
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);