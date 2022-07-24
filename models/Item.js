const mongoose = require("mongoose");

const ItemSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: [
    {
      categoryId: {
        type: String,
        required: false,
      }
    },
  ],
  image: {
    type: String,
    required: false,
  },
  isActive: {
    type: Boolean,
    required: false,
    default: true,
  },
  price: {
    type: Number,
    required: false,
    default: 0,
  },
  description: {
    type: String,
    required: false,
  },
});

const Item = mongoose.model("Item", ItemSchema);
module.exports = Item;
