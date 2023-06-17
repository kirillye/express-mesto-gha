const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxLength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 3,
    maxLength: 30,
  },
  avatar: {
    type: String,
    required: true,
    minlength: 3,
  },
});

module.exports = mongoose.model("user", userSchema);