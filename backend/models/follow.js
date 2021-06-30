const mongoose = require("mongoose");

const followSchema = mongoose.Schema({
    userFollowing: {type: String, required: true},
    followedUser: {type: String, required: true}
});


module.exports = mongoose.model("Follow", followSchema);