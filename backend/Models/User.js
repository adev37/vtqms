const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+\@.+\..+/, "Please enter a valid email address"],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    required: true,
    enum: ["admin", "student"],
  },
  canSeeMCQ: {
    type: Boolean,
    default: false,
  },
  canSeeTrueFalse: {
    type: Boolean,
    default: false,
  },
  canSeeFillBlank: {
    type: Boolean,
    default: false,
  },
});

const UserModel = mongoose.model("users", userSchema);
module.exports = UserModel;
