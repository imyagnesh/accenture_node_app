const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required."],
  },
  bio: {
    type: String,
  },
  website: {
    type: String,
  },
});

const Author = mongoose.model("Author", authorSchema);

module.exports = Author;
