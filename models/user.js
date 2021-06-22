const mongoose = require("mongoose");
const timestamps = require("mongoose-times");
const Schema = mongoose.Schema;

const userSchema = Schema({
  provider: {
    type: String,
    required: true
  },
  name: {
    type: String,
    require: true,
  },
  about: {
    type: String
  },
  email: {
    type: String,
    require: true,
  },
  image: {
    type: String,
  },
  googleId: {
    type: String
  }
});

userSchema.plugin(timestamps);
module.exports = mongoose.model("User", userSchema);
