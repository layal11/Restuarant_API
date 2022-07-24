const mongoose = require("mongoose");

const CategorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    required: false,
    default: true,
  },
  image: {
    type: String,
    required: false,
  },
});

const Category = mongoose.model("Category", CategorySchema);
module.exports = Category;
