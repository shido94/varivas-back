// Load required packages
const mongoose = require('mongoose');
const timestamps = require("mongoose-times");

const Schema = mongoose.Schema;
const userFollowSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    followUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
});

userFollowSchema.plugin(timestamps);
// Export the Mongoose model
module.exports = mongoose.model('followers', userFollowSchema);